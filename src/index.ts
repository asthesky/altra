import { EventEmitter } from "events";

import { buildFiles } from "./process/build";
import { watchFiles } from "./process/watch";
import { buildDts } from "./process/buildDts";
import { execFiles } from "./process/exec";
//
import { createFiles } from "./process/create";
import { cleanFiles } from "./process/clean";
import { lintFiles } from "./process/lint";
import { testFiles } from "./process/test";

import { getLogger } from "./utils/logger";
import { getConfig } from "./config/index";

import type { Logger } from "./utils/logger";
import type { AltraOptions, AltraConfigs } from "./config";

/**
 * ALTRA合并处理
 *
 * @param {AltraOptions} options
 * @returns {AltraConfigs}
 */
export class Altra extends EventEmitter {
  logger: Logger;
  //
  config: AltraConfigs;
  //
  result: undefined;
  //
  constructor(options: AltraOptions = {}) {
    super();
    options.root = process.cwd();
    //
    this.logger = getLogger();
    this.config = getConfig(options);
  }

  async exec() {
    const { config, logger } = this;
    const { command, pkgConfig } = config;

    logger.info("CLI", `altra v${pkgConfig?.version}`);

    if (command == "clean") {
      await cleanFiles(this);
    } else if (command == "build") {
      await buildFiles(this);
    } else if (command == "buildDts") {
      await buildDts(this);
    } else if (command == "watch") {
      await watchFiles(this);
    } else if (command == "create") {
      await createFiles(this);
    } else if (command == "lint") {
      await lintFiles(this);
    } else if (command == "test") {
      await testFiles(this);
    } else {
      await execFiles(this);
    }

    logger.info("CLI", `altra end`);
  }
}
