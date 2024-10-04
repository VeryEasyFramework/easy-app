import type {
  SMTPCapabilities,
  SMTPCommand,
  SMTPHeader,
  SMTPOptions,
  State,
} from "#/package/emailPack/smtp/smtpTypes.ts";

class _SMTPEmail {
  header: SMTPHeader;
  body: string;
  constructor(header: SMTPHeader, body: string) {
    this.header = header;
    this.body = body;
  }
}

export class SMTPClient {
  smtpServer: string;
  domain: string;
  port: number;
  userLogin: string;
  password: string;
  private waitDuration = 10;
  private timeoutDuration = 5000;

  private states: {
    [key in State]: boolean;
  } = {
    notStarted: true,
    connecting: false,
    connected: false,
    tlsChecking: false,
    tlsCapable: false,
    tlsReady: false,
    tlsConnecting: false,
    tlsConnected: false,
    sayingHello: false,
    authReady: false,
    authenticating: false,
    authUsername: false,
    authPassword: false,
    authenticated: false,
  };

  onStateChange(state: State, message: string) {
    console.log(message);
  }

  async waitForState(state: State): Promise<boolean> {
    let timeout = 0;

    while (!this.states[state]) {
      await new Promise((resolve) => setTimeout(resolve, this.waitDuration));
      timeout += this.waitDuration;
      if (timeout >= this.timeoutDuration) {
        return false;
      }
    }
    return true;
  }

  capabilities: SMTPCapabilities = {
    PIPELINING: false,
    STARTTLS: false,
    SMTPUTF8: false,
    AUTH: {
      LOGIN: false,
      PLAIN: false,
      CRAM_MD5: false,
      XOAUTH2: false,
      PLAIN_CLIENTTOKEN: false,
      OAUTHBEARER: false,
      XOAUTH: false,
    },
    "8BITMIME": false,
    ENHANCEDSTATUSCODES: false,
    CHUNKING: false,
    SIZE: 0,
  };

  private connection?: Deno.TcpConn;
  private tlsConnection?: Deno.TlsConn;
  constructor(config: SMTPOptions) {
    this.smtpServer = config.smtpServer;
    this.port = config.port;
    this.userLogin = config.userLogin;
    this.password = config.password;
    this.domain = config.domain;
  }

  handleChunk(chunk: Uint8Array) {
    const decoder = new TextDecoder();
    const chunkString = decoder.decode(chunk);
    const lines = chunkString.split("\r\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "") {
        continue;
      }
      this.handleLine(lines[i]);
    }
  }

  handleLine(row: string) {
    const code = parseInt(row.substring(0, 3), 10);
    const message = row.substring(4);
    switch (code) {
      case 220:
        this.handle220(message);
        break;
      case 235:
        this.handle235(message);
        break;
      case 250:
        this.handle250(message);
        break;
      case 334:
        this.handle334(message);
        break;
      case 454:
        this.handle4Error(code, message);
        break;
      case 503:
        this.handle5Error(code, message);
        break;

      default:
        console.log("Unhandled code", code, message);
    }
  }

  handle5Error(code: number, message: string) {
    console.log("Error", code, message);
    throw new Error(message, {
      cause: "SMTP Error 503",
    });
  }
  handle4Error(code: number, message: string) {
    console.log("Error", code, message);
  }
  handle235(message: string) {
    this.states.authenticated = true;
  }
  handle334(message: string) {
    const m = atob(message);
    if (m === "Username:") {
      this.states.authUsername = true;
    }
    if (m === "Password:") {
      this.states.authPassword = true;
    }
  }
  handle220(message: string) {
    if (!this.states.connected) {
      this.states.connected = true;
      return;
    }
    if (this.states.tlsChecking) {
      this.states.tlsReady = true;
      return;
    }
  }

  handle250(message: string) {
    if (this.states.sayingHello || this.states.authReady) {
      this.parseHeloRow(message);
    }
  }
  parseHeloRow(row: string) {
    const words = row.split(" ");
    const firstWord = words[0] as keyof SMTPCapabilities | "Hello";
    if (firstWord === "Hello") {
      return;
    }
    if (words.length > 1) {
      if (words[1] === "Hello") {
        return;
      }
    }
    switch (firstWord) {
      case "STARTTLS":
        this.capabilities.STARTTLS = true;
        this.states.tlsCapable = true;
        break;
      case "AUTH":
        words.slice(1).forEach((auth) => {
          this.capabilities.AUTH[auth as keyof SMTPCapabilities["AUTH"]] = true;
        });
        this.states.authReady = true;
        break;
      case "SIZE":
        this.capabilities.SIZE = parseInt(words[1], 10);
        break;
      default:
        this.capabilities[firstWord] = true;
        break;
    }
  }
  async startTLS() {
    this.states.tlsChecking = true;
    await this.sendCommand("STARTTLS");
  }

  async sayHello() {
    this.states.sayingHello = true;
    await this.sendCommand("EHLO", this.domain);
  }

  async authLogin() {
    this.states.authenticating = true;
    await this.sendCommand("AUTH", "LOGIN");
    await this.waitForState("authUsername");

    const username = btoa(this.userLogin);
    await this.sendCommand(username);
    await this.waitForState("authPassword");
    const password = btoa(this.password);
    await this.sendCommand(password);
    await this.waitForState("authenticated");
  }
  async connect() {
    this.onStateChange("connecting", "Connecting to SMTP Server...");
    this.states.connecting = true;
    this.connection = await Deno.connect({
      port: this.port,
      hostname: this.smtpServer,
    });
    const write = (chunk: Uint8Array) => {
      this.handleChunk(chunk);
    };
    const reader = this.connection.readable.getReader();
    reader.read().then((result) => {
      result.value && write(result.value);
      if (result.done) {
        console.log("Connection Closed");
      }
    });

    const connected = await this.waitForState("connected");
    if (!connected) {
      throw new Error("Connection Timeout");
    }

    this.onStateChange(
      "connected",
      "Connected to SMTP Server, checking capabilities...",
    );
    await this.sayHello();

    reader.read().then((result) => {
      result.value && write(result.value);
    });

    await this.waitForState("tlsCapable");

    this.onStateChange(
      "tlsCapable",
      "Server is capable of TLS, initiating TLS handshake...",
    );

    await this.startTLS();
    reader.read().then((result) => {
      result.value && write(result.value);
    });
    await this.waitForState("tlsReady");
    this.states.tlsConnecting = true;
    this.tlsConnection = await Deno.startTls(this.connection, {
      hostname: this.smtpServer,
    });
    this.connection = undefined;

    this.tlsConnection.readable.pipeTo(
      new WritableStream({
        write,
      }),
    );
    this.states.tlsConnected = true;
    this.onStateChange(
      "tlsConnected",
      "TLS Connection established, initiating authentication...",
    );
    await this.sayHello();

    await this.waitForState("authReady");
    await this.authLogin();
    this.onStateChange(
      "authenticated",
      "Authenticated with SMTP Server 🎉. Ready to send some emails!",
    );
  }

  async sendCommand(command: SMTPCommand | string, data?: string) {
    const connection = this.tlsConnection || this.connection;
    if (!connection) {
      throw new Error("Connection is not established");
    }
    const encoder = new TextEncoder();
    let commandString = command;
    if (data) {
      commandString = `${command} ${data}`;
    }
    commandString += "\r\n";

    await connection.write(encoder.encode(commandString));
  }

  send(email: _SMTPEmail) {
    console.log("send email", email);
  }
}
