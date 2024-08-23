import { TaskView } from "@vef/easy-cli";
import { cli } from "#/package/basePack/boot/cli/cli.ts";
import { CommandSession } from "@vef/easy-ops";
import { EasyOps } from "@vef/easy-ops";

const easyOp = new EasyOps({
  sessionType: "local",
  cwd: Deno.cwd(),
});

export const releaseView = new TaskView({
  title: "Build Release",
  description: "Build a release of the app",
  clock: true,
});

releaseView.addTask("Compile", {
  messages: {
    pending: "Waiting to start the build",
    running: "Compiling the app",
    failed: "Failed to compile the app",
    done: "App compiled successfully",
  },
  action: async ({ fail, output, success }) => {
    // output("Compiling the app...");
    // easyOp.session.stdErrCallback = (line) => {
    //   output(new TextDecoder().decode(line));
    // };
    // easyOp.session.stdOutCallback = (line) => {
    //   output(new TextDecoder().decode(line));
    // };
    const results = await easyOp.runTask("deno", "compile", {
      script: "main.ts",
      permission: {
        allow: ["all"],
      },
      unstable: ["net"],
      output: "release/app",
      target: "x86_64-unknown-linux-gnu",
    });
    output(results.status);
    output("App compiled successfully");
    success();

    // Compile the app
  },
});

releaseView.addTask("Copy Assets", {
  action: async ({ fail, output, success }) => {
    // Copy the assets
    output("Copying the assets...");
    const { stderr, stdout } = await easyOp.session.runCommand(
      "cp -r public release/public",
      true,
    );

    if (stderr.length > 0) {
      stderr.forEach((line) => {
        output(line);
      });
      fail();
      return;
    }

    output("Assets copied successfully");
    success();
    releaseView.done();
  },
});

releaseView.onStart(async () => {
  await easyOp.init();
});
releaseView.onDone(() => {
  cli.changeView("main");
});
