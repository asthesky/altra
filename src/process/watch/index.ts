import { watch } from "rollup";

import { cleanDist, outputCjsEntry } from "../build/utils";

import type { Altra } from "../../index";

export async function watchFiles(ctx: Altra) {
  const { config, logger } = ctx;
  const { rollupConfig } = config;

  cleanDist(config.distPath);

  if (config.formats.includes("cjs")) {
    await outputCjsEntry(config.name, config.distPath);
  }

  // const spinner = ora().start();
  let signalError = false;
  let signalWatchOnce = false;

  if (rollupConfig) {
    watch(rollupConfig).on("event", async (event) => {
      // clear previous onSuccess/onFailure hook processes so they don't pile up
      // await killHooks();

      if (event.code === "START") {
        logger.clean();
        logger.info("WATCH", "Compiling modules...");
      } else if (event.code === "ERROR") {
        logger.error("WATCH", "Failed to compile");

        console.log(event);

        signalError = true;
        // failureKiller = run(opts.onFailure);
      }
      if (event.code === "END") {
        if (!signalError) {
          logger.success("WATCH", "Compiled successfully");
        }

        if (!signalWatchOnce) {
          logger.info("WATCH", "Watching for changes");
          signalWatchOnce = true;
        }

        try {
          // await deprecated.moveTypes();
          // if (firstTime && opts.onFirstSuccess) {
          //   firstTime = false;
          //   run(opts.onFirstSuccess);
          // } else {
          //   successKiller = run(opts.onSuccess);
          // }
        } catch (_error) {}
      }
    });
  }

  logger.info("CLI", "");
}
