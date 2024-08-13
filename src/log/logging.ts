import { colorMe, ColorName } from "@vef/color-me";

import { formatUtils, printUtils } from "@vef/easy-cli";
const tab = "  ";
export type LogType = "Error" | "Info" | "Warning" | "Debug" | "Message";

const typeColors: Record<LogType, ColorName> = {
  Error: "red",
  Info: "green",
  Warning: "yellow",
  Debug: "blue",
  Message: "white",
} as const;

const box = printUtils.symbol.box;
export const easyLog = {
  message: (content: any | any[], subject?: string) =>
    log(content, "Message", subject),
  error: (content: any | any[], subject?: string, hideTrace?: boolean) =>
    log(content, "Error", subject, hideTrace),
  info: (content: any | any[], subject?: string) =>
    log(content, "Info", subject),
  warning: (content: any | any[], subject?: string, hideTrace?: boolean) =>
    log(content, "Warning", subject, hideTrace),
  debug: (content: any | any[], subject?: string) =>
    log(content, "Debug", subject),
} as const;
function log(
  content: any | any[],
  type?: LogType,
  subject?: string,
  hideTrace?: boolean,
) {
  if (!type && !subject) {
    type = "Debug";
  }
  const message: string[] = [];

  const title = subject || type || "Log";
  const showTrace = type === "Error" || type === "Warning";
  const shouldHideTrace = hideTrace && type != "Debug";
  if (showTrace && !shouldHideTrace) {
    //get the calling function
    const stack = new Error().stack;
    let lines: string[] = [];

    stack?.split("\n").slice(3, -1).forEach((line, index) => {
      line = line.trim().replace("at ", "");
      const args = line.split(" (");
      let func = args[0];
      if (func.includes(".")) {
        const fullFunc = func.split(".");
        func = `${colorMe.brightGreen(fullFunc[fullFunc.length - 2])}.${
          colorMe.brightYellow(
            fullFunc[fullFunc.length - 1],
          )
        }${colorMe.brightWhite("()")}`;
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
      const out = `${func} ${file}`;
      lines.push(out);
    });
    lines = lines.reverse();
    lines = lines.map((line, index) => {
      for (let i = 0; i < index; i++) {
        line = tab + line;
      }
      return `${line}`;
    });
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
