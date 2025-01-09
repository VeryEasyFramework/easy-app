import { raiseEasyException } from "#/easyException.ts";
interface CapabilityMap {
  // IMAP4rev1 UNSELECT IDLE NAMESPACE QUOTA ID XLIST CHILDREN X-GM-EXT-1 UIDPLUS COMPRESS=DEFLATE ENABLE MOVE CONDSTORE ESEARCH UTF8=ACCEPT LIST-EXTENDED LIST-STATUS LITERAL- SPECIAL-USE APPENDLIMIT=35651584"
  "IMAP4rev1": boolean;
  "UNSELECT": boolean;
  "IDLE": boolean;
  "NAMESPACE": boolean;
  "QUOTA": boolean;
  "ID": boolean;
  "XLIST": boolean;
  "CHILDREN": boolean;
  "X-GM-EXT-1": boolean;
  "UIDPLUS": boolean;
  "COMPRESS": "DEFLATE";
  "ENABLE": boolean;
  "MOVE": boolean;
  "CONDSTORE": boolean;
  "ESEARCH": boolean;
  "UTF8": "ACCEPT";
  "LIST-EXTENDED": boolean;
  "LIST-STATUS": boolean;
  "LITERAL-": boolean;
  "SPECIAL-USE": boolean;
  "APPENDLIMIT": {
    size: number;
    enabled: boolean;
  };
}
type ImapState = "connected" | "authenticated" | "selected" | "idle";
class ImapClient {
  waitDuration = 100;
  timeoutDuration = 5000;
  host: string;
  port: number;
  user: string;
  password: string;
  authenticated = false;
  capabilities: Map<keyof CapabilityMap, string | boolean> = new Map();
  messages: Map<string, string> = new Map();
  connection!: Deno.TlsConn;
  constructor(options: {
    host: string;
    port: number;
    user: string;
    password: string;
  }) {
    this.host = options.host;
    this.port = options.port;
    this.user = options.user;
    this.password = options.password;
  }
  public async connect() {
    this.connection = await Deno.connectTls({
      hostname: this.host,
      port: this.port,
    });
    const textStream = new TextEncoderStream();

    this.connection.readable.pipeThrough(new TextDecoderStream())
      .pipeTo(
        new WritableStream(
          {
            write: (chunk) => {
              this.handleChunk(chunk);
            },
          },
        ),
      );
    // await this.waitForState("connected");
    // await this.sendCommand("CAPABILITY");
    await this.login();
  }
  async waitForTag(tag: string): Promise<boolean> {
    let timeout = 0;

    while (true) {
      if (this.messages.has(tag)) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, this.waitDuration));
      timeout += this.waitDuration;
      if (timeout >= this.timeoutDuration) {
        raiseEasyException(
          `Timeout waiting for ${tag}`,
          500,
        );
        return false;
      }
    }
  }
  async login() {
    const loginTag = await this.sendCommand(
      `LOGIN ${this.user} ${this.password}`,
      true,
    );
    const loginMessage = this.getMessage(loginTag);
    if (loginMessage.command === "OK") {
      this.authenticated = true;
      console.log("Authenticated");
      ``;
      console.log(Object.fromEntries(this.capabilities));
    } else {
      raiseEasyException(`Failed to login: ${loginMessage.message}`, 500);
    }
  }
  async sendCommand(command: string, sync?: boolean) {
    const tag = this.getTag();
    command = `${tag} ${command}\r\n`;
    console.log(command);
    const encoder = new TextEncoder();
    await this.connection.write(encoder.encode(command));
    if (sync) {
      await this.waitForTag(tag);
    }
    return tag;
  }
  handleChunk(chunk: string) {
    const responses = chunk.split("\r\n");
    for (const response of responses) {
      const parts = response.split(" ");
      const tag = parts[0];
      const command = parts[1];
      const message = parts.slice(2).join(" ");
      if (tag === "*") {
        this.handleGenericResponse(command, message);
      }
      this.messages.set(tag, JSON.stringify({ command, message }));
    }
  }
  handleGenericResponse(command: string, message: string) {
    console.log({ command, message });
    if (command === "CAPABILITY") {
      this.parseCapabilities(message);
    }
  }

  parseCapabilities(capabilities: string) {
    const capabilityList = capabilities.split(" ");
    for (const capabilityEntry of capabilityList) {
      const parts = capabilityEntry.split("=");
      const capability = parts[0] as keyof CapabilityMap;
      if (parts.length > 1) {
        const value = parts[1];
        this.capabilities.set(capability, value);
        continue;
      }
      this.capabilities.set(capability, true);
    }
  }
  getTag() {
    return `A${this.messages.size + 1}`;
  }

  getMessage(tag: string) {
    const message = this.messages.get(tag);
    if (!message) {
      raiseEasyException(`No message found for tag ${tag}`, 500);
    }
    return JSON.parse(message);
  }
  public getMessages() {
    console.log("ImapClient getMessages");
  }
}
