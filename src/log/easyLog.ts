import { getEnv } from "#/appConfig/configEnv.ts";
import type { LogType } from "#/log/logging.ts";

export class EasyLogger {
  environment: "development" | "production";
  logPath: string;

  constructor() {
    this.environment = getEnv("VEF_ENVIRONMENT");
    this.logPath = "./logs";
    this.validateLogPath();
  }

  private validateLogPath() {
    Deno.mkdirSync(this.logPath, { recursive: true });
  }

  private saveLogEntry(options: {
    content: string;
    type: LogType;
    subject: string;
  }) {
    const { content, type, subject } = options;
    const time = new Date().toISOString();
    const logPath = `${this.logPath}/${type}.log`;
    const logEntry = `[${time}] ${type.toUpperCase()} ${subject}: ${
      this.sanitize(content)
    }`;
    Deno.writeTextFileSync(logPath, logEntry + "\n", { append: true });
  }

  private sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9\s]/g, "");
  }
  log(options: {
    content: any | any[];
    type: LogType;
    subject: string;
  }) {
    if (typeof options.content !== "string") {
      options.content = String(options.content);
    }
    this.saveLogEntry(options);
  }
}
