import { removeFiles } from "../../utils";

import type { Altra } from "../../index";

export async function cleanDist(ctx: Altra) {
  const { config, logger } = ctx;

  await removeFiles(["**/*", "!**/*.d.ts"], config.distDir);

  logger.info("CLI", "Cleaning output folder");
}

export async function buildFiles(ctx: Altra) {
  const { config, logger } = ctx;
  const { pkgConfig } = config;

  const startTime = Date.now();

  logger.info("CLI",  `${pkgConfig?.version} ${startTime}`);
}
