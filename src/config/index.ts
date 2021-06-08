import path from "path";

import { getPkgConfig } from "./modules/package";
import { getTsconfigPath, getTsconfig } from "./modules/typescript";
import { getRollupConfig } from "./modules/rollup";
import { getJestConfig } from "./modules/jest";

import type { RollupOptions } from "rollup";
import type { Alias } from "@rollup/plugin-alias";
import type { CompilerOptions } from "typescript";
import type { PkgConfig } from "./modules/package";
import type { PostCSSConfigs } from "./modules/postcss";
import type { JestConfigOptions } from "./modules/jest";

export type CommandType = "clean" | "create" | "build" | "watch" | "buildDts" | "test" | "lint";
export type EnvType = "development" | "production" | "test";
export type FromatType = "iife" | "es" | "umd" | "cjs";

// 用户配置
export interface AltraOptions {
  env?: EnvType;
  command?: CommandType;
  root?: string;
  srcDir?: string;
  distDir?: string;
  altraConfigName?: string;
  // ts
  tsconfigName?: string;
  tsconfigOptions?: CompilerOptions;
  // rollup
  rollupOptions?: RollupOptions;
  aliasOptions?: Alias;
  postcssOptions?: PostCSSConfigs;
}

// 项目配置
export interface AltraConfigs {
  name: string;
  env: EnvType;
  command: CommandType;
  entry: string | string[];
  formats: FromatType[];
  //
  root: string;
  srcDir: string;
  distDir: string;
  srcPath: string;
  distPath: string;
  watchIgnored: string[];
  altraConfigName: string;
  altraConfigFile: string;
  altraHomeConfigFile: string; //
  // pkg
  pkgConfig?: PkgConfig;
  // ts
  tsconfigName: string;
  tsconfigFile?: string;
  compilerOnly?: boolean;
  tsconfig?: CompilerOptions;
  // rollup
  rollupOptions?: RollupOptions;
  aliasOptions?: Alias;
  postcssOptions?: PostCSSConfigs;
  sourcemap?: boolean;
  rollupConfig?: RollupOptions;
  // jest
  jestConfig?: JestConfigOptions;
}

/**
 * 获取config配置
 *
 * @param {AltraOptions} options
 * @returns {AltraConfigs}
 */
const defaultConfig: AltraConfigs = {
  name: "",
  env: "development",
  command: "build",
  entry: "src/index.ts",
  formats: ["es"],
  //
  root: "",
  srcDir: "src",
  distDir: "dist",
  srcPath: "",
  distPath: "",
  watchIgnored: [],
  altraConfigName: "ata.config.js",
  altraConfigFile: "",
  altraHomeConfigFile: "", //
  // ts
  tsconfigName: "tsconfig.json"
};

// 获取本项目配置
export function getConfig(options: AltraOptions) {
  const config: AltraConfigs = Object.assign({}, defaultConfig, options);

  // 获取Custom配置
  try {
    const configPath = path.resolve(config.root as string, config.altraConfigName as string);
    const fileConfig = require(configPath);

    if (typeof fileConfig == "object") {
      Object.assign(config, fileConfig);
      config.altraConfigFile = configPath;
    }
  } catch (err) {
    console.error(err);
    console.log("Using default config");
  }

  // 获取Path配置
  config.srcPath = path.resolve(config.root, config.srcDir || "src");
  config.distPath = path.resolve(config.root, config.distDir || "dist");
  config.watchIgnored = ["**/{.git,node_modules}/**", config.distPath, ...(config.watchIgnored || [])];

  // 获取pkgConfig配置
  config.pkgConfig = getPkgConfig(config.root);

  // 获取tsconfig配置
  config.tsconfigFile = getTsconfigPath(config.root, config.tsconfigName as string);
  config.tsconfig = getTsconfig(config.root, config.tsconfigFile);

  // 获取rollup配置
  if (["build", "watch", "buildDts"].includes(config.command)) {
    config.rollupConfig = getRollupConfig(config, "es");
  }

  // 获取jest配置
  if (config.command == "test") {
    config.jestConfig = getJestConfig(config);
  }

  return config as AltraConfigs;
}
