import type { EasyApp } from "#/app/easyApp.ts";
import { easyLog } from "#/log/logging.ts";
import begin from "#/app/runner/begin.ts";
import processArgs from "#/app/runner/processArgs.ts";
import runMessageBroker from "#/app/runner/runMessageBroker.ts";

export default async function appRunner(app: EasyApp, args: string[]) {
  const argsRecord = processArgs(args);
  const { enable, port } = app.config.realtimeOptions;
  if (argsRecord.broker && enable) {
    runMessageBroker(port);
    return;
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

  if (argsRecord.app) {
    app.serve({
      name: argsRecord.name,
    });
    return;
  }

  if (argsRecord.serve) {
    begin({
      args,
    });
    return;
  }

  app.cli.run();
  app.cli.changeView("main");
}
