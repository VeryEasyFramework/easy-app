import { TaskView } from "@vef/easy-cli";

import { EasyOps } from "@vef/easy-ops";
import type { EasyApp } from "#/easyApp.ts";

export function setupReleaseView(app: EasyApp): void {
  const easyOp = new EasyOps({
    sessionType: "local",
    cwd: Deno.cwd(),
  });

  const releaseView = new TaskView({
    title: "Build Release",
    description: "Build a release of the app",
    clock: true,
  });

  releaseView.addTask("Validate Release Folder", {
    action: async ({ fail, output, success }) => {
      const { stderr, stdout } = await easyOp.session.runCommand(
        "mkdir -p release",
        true,
      );
      if (stderr.length > 0) {
        stderr.forEach((line) => {
          output(line);
        });
        fail();
        return;
      }
      output("Release folder validated");
      success();
    },
  });

  releaseView.addTask("Compile Linux", {
    messages: {
      pending: "Waiting to start the build",
      running: "Building the linux binary ",
      failed: "Failed to build the linux binary",
      done: "Built the linux binary successfully",
    },
    action: async ({ fail, output, success }) => {
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

      output("Built the linux binary successfully");
      success();
    },
  });
  releaseView.addTask("Compile Windows", {
    messages: {
      pending: "Waiting to start the build",
      running: "Building the windows executable",
      failed: "Failed to build the windows executable",
      done: "Built the windows executable successfully",
    },
    action: async ({ fail, output, success }) => {
      const results = await easyOp.runTask("deno", "compile", {
        script: "main.ts",
        permission: {
          allow: ["all"],
        },
        unstable: ["net"],
        output: "release/app",
        target: "x86_64-pc-windows-msvc",
      });
      output(results.status);
      output("Built the windows executable successfully");
      success();
    },
  });
  releaseView.addTask("Compile MacOs", {
    messages: {
      pending: "Waiting to start the build",
      running: "Building the macos binary",
      failed: "Failed to build the macos binary",
      done: "Built the macos binary successfully",
    },
    action: async ({ fail, output, success }) => {
      const results = await easyOp.runTask("deno", "compile", {
        script: "main.ts",
        permission: {
          allow: ["all"],
        },
        unstable: ["net"],
        output: "release/appOsx",
        target: "x86_64-apple-darwin",
      });
      output(results.status);
      output("Built the macos binary successfully");
      success();
    },
  });

  releaseView.addTask("Copy Assets", {
    action: async ({ fail, output, success }) => {
      // clear the public folder
      output("Clearing the public folder...");
      const { stderr: clearStderr, stdout: clearStdout } = await easyOp.session
        .runCommand(
          "rm -rf release/public",
          true,
        );
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
    releaseView.cli.changeView("main");
  });
  app.cli.addView(releaseView, "release");
}
