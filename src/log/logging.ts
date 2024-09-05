import {
  type BasicFgColor,
  ColorMe,
  formatUtils,
  printUtils,
} from "@vef/easy-cli";
const { symbol } = printUtils;
const tab = "  ";
export type LogType = "Error" | "Info" | "Warning" | "Debug" | "Message";

const typeColors: Record<LogType, BasicFgColor> = {
  Error: "red",
  Info: "green",
  Warning: "yellow",
  Debug: "blue",
  Message: "white",
} as const;

const box = printUtils.symbol.box;

interface LogOptions {
  hideTrace?: boolean;
  traceOffset?: number;
  stack?: string;
}
export const easyLog = {
  message: (
    content: any | any[],
    subject?: string,
    options?: LogOptions,
  ): void => log({ content, type: "Message", subject, ...options }),
  error: (
    content: any | any[],
    subject?: string,
    options?: LogOptions,
  ): void => log({ content, type: "Error", subject, ...options }),
  info: (content: any | any[], subject?: string): void =>
    log({ content, type: "Info", subject }),
  warning: (
    content: any | any[],
    subject?: string,
    options?: LogOptions,
  ): void => log({ content, type: "Warning", subject, ...options }),
  debug: (content: any | any[], subject?: string): void =>
    log({ content, type: "Debug", subject }),
} as const;
function log(options: {
  content: any | any[];
  type?: LogType;
  subject?: string;
  hideTrace?: boolean;
  traceOffset?: number;
  stack?: string;
}) {
  let { content, type, subject, hideTrace, traceOffset, stack } = options;
  if (!type && !subject) {
    type = "Debug";
  }
  const message: string[] = [];

  const title = subject || type || "Log";
  const showTrace = type === "Error" || type === "Warning";
  const shouldHideTrace = hideTrace && type != "Debug";
  if (showTrace && !shouldHideTrace) {
    //get the calling function
    stack = stack || new Error().stack;
    let lines: string[] = [];

    stack?.split("\n").slice(1, -1).forEach((line, index) => {
      line = line.trim().replace("at ", "");
      let out = line;

      if (!line.startsWith("file://")) {
        const args = line.split(" (");
        let func = args[0];
        if (func.includes(".")) {
          const fullFunc = func.split(".");
          func = ColorMe.chain().content(fullFunc[fullFunc.length - 2])
            .color("brightGreen")
            .content(".")
            .color("white")
            .content(fullFunc[fullFunc.length - 1])
            .color("brightYellow")
            .content("()")
            .color("brightWhite")
            .end();

          // func = `${fgGreen}${fullFunc[fullFunc.length - 2]}.${fgYellow}${
          //   fullFunc[fullFunc.length - 1]
          // }${fgWhite}()${reset}`;
        }
        func = func.replace("async ", "");
        const file = args[1]?.replace(")", "");
        let tabs = "";
        for (let i = 0; i < index; i++) {
          tabs += tab;
        }
        out = `${func} ${ColorMe.fromOptions(file, { color: "brightCyan" })}`;
        if (line.startsWith("ext:deno")) {
          return;
        }
      }
      if (line.startsWith("file://")) {
        out = ColorMe.standard()
          .content("Start ").color("brightWhite").bold()
          .content(symbol.arrowRight + " ").color("brightMagenta")
          .bold()
          .content(line).color("brightCyan")
          .end();
      }

      lines.push(`${out}\n`);
    });

    lines = lines.reverse();
    if (type === "Error") {
      message.push(lines.join("\n"));
    } else {
      message.push(lines[lines.length - 1].trim());
    }
  }
  const args = Array.isArray(content) ? content : [content];
  //
  const contentStr = args.map((arg) => {
    if (typeof arg === "object") {
      return JSON.stringify(arg, null, 2);
    }

    return formatUtils.center(arg);
  });
  message.push(...contentStr);
  // message.push(reset);
  // printUtils.symbols;
  // message.push();

  const titleRow = formatUtils.center(title, box.horizontal, {
    color: typeColors[type || "Message"],
  });

  printUtils.println(titleRow);
  printUtils.printLines(1);
  for (const line of message) {
    printUtils.println(line);
  }
  const row = formatUtils.fill(box.horizontal, {
    color: typeColors[type || "Message"],
  });
  printUtils.printLines(1);
  printUtils.println(row);
  printUtils.printLines(1);
}
