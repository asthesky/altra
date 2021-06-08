// import fs from "fs";
import { removeFiles } from "../../utils";

import type { Altra } from "../../index";

export async function cleanFiles(ctx: Altra) {
  const { config, logger } = ctx;

  await removeFiles(["**/*", "!**/*.d.ts"], config.distDir);

  logger.info("CLI", "Cleaning output folder");
}
