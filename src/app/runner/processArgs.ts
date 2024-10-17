type Args = {
  name?: string;
  prod?: boolean;
  broker?: boolean;
  app?: boolean;
  worker?: "short" | "medium" | "long" | undefined;
} & Record<string, boolean>;
export default function processArgs(args: string[]) {
  const argsRecord: Args = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n") {
      argsRecord.name = args[i + 1];
      i++;
      continue;
    }
    if (args[i] === "--worker") {
      const worker = args[i + 1];
      const workerTypes = ["short", "medium", "long"];
      if (!workerTypes.includes(worker)) {
        throw new Error(`Invalid worker type ${worker}`);
      }
      argsRecord.worker = worker as "short" | "medium" | "long";
      i++;
      continue;
    }
    if (args[i] === "--prod") {
      argsRecord.prod = true;
      continue;
    }
    argsRecord[args[i]] = true;
  }
  return argsRecord;
}
