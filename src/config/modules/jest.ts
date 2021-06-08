import path from "path";

import type { Config } from "@jest/types";
import type { AltraConfigs } from "../index";

export type JestConfigOptions = Partial<Config.InitialOptions>;

export function getJestConfig(config: AltraConfigs): JestConfigOptions {
  const jestConfig: JestConfigOptions = {
    transform: {
      ".(ts|tsx)$": require.resolve("ts-jest/dist"),
      ".(js|jsx)$": require.resolve("babel-jest") // jest's default
    },
    transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
    testMatch: ["<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}"],
    testURL: "http://localhost",
    rootDir: config.root,
    watchPlugins: [require.resolve("jest-watch-typeahead/filename"), require.resolve("jest-watch-typeahead/testname")]
  };

  // 获取Custom配置
  try {
    const configPath = path.resolve(config.root, "jest.config.js");
    const fileConfig = require(configPath);

    if (typeof fileConfig == "object") {
      Object.assign(jestConfig, fileConfig);
    }
  } catch (err) {
    console.error(err);
    console.log("jest config err");
  }

  return jestConfig;
}
