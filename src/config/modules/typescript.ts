import ts from "typescript";

import type { ParsedCommandLine, CompilerOptions } from "typescript";

export function getTsconfigPath(root: string, tsconfigName: string) {
  const tsConfigFile = ts.findConfigFile(root, ts.sys.fileExists, tsconfigName);

  if (!tsConfigFile) {
    console.warn(`tsconfig.json not found in the current directory! ${root}`);
  }
  return tsConfigFile || "";
}

/**
 * 获取tsconfig配置
 *
 * @param {string,string} root,tsconfigName
 * @returns {{tsConfig:ParsedCommandLine,tsConfigFile:string}}
 */

// const defTsConfig = {};

//
export function getTsconfig(root: string, tsConfigFile: string) {
  const configFile = ts.readConfigFile(tsConfigFile, ts.sys.readFile);
  const tsConfig: ParsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root);

  return tsConfig.options as CompilerOptions;
}
