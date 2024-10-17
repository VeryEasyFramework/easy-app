import type { EasyApp } from "#/app/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import begin from "#/app/runner/begin.ts";
import processArgs from "#/app/runner/processArgs.ts";
import runMessageBroker from "#/app/runner/runMessageBroker.ts";
import runWorker from "#/app/runner/runWorker.ts";

export default async function appRunner(app: EasyApp, args: string[]) {
  const argsRecord = processArgs(args);
  const { realtimeOptions } = app.config;
  if (argsRecord.broker && realtimeOptions.enable) {
    runMessageBroker(realtimeOptions.port);
    return;
  }
  if (argsRecord.name) {
    app.processNumber = argsRecord.name;
  }
  try {
    await app.boot();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const errorClass = e instanceof Error ? e.constructor.name : "Unknown";
    easyLog.error(
      `Error booting app: ${message} (${errorClass})`,
      "Boot",
      {
        stack: e instanceof Error ? e.stack : undefined,
      },
    );

    app.exit(0);
  }

  if (argsRecord.worker) {
    runWorker(app, argsRecord.worker);
    return;
  }

  if (argsRecord.app) {
    app.serve({
      name: argsRecord.name,
    });
    return;
  }

  if (argsRecord.serve) {
    console.clear();
    begin({
      multiProcess: app.config.multiProcessing,
      signal: new AbortController().signal,
      args,
    });
    return;
  }

  app.cli.run();
  app.cli.changeView("main");
}
