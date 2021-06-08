import type { BuildOptions } from "esbuild";
import type { ParsedCommandLine } from "typescript";

/**
 * 获取esbuildConfig配置
 *
 * @param {string,string} root,tsconfigName
 * @returns {PkgConfig}
 */

const defEsbuildOptions: EsbuildOptions = {
  outdir: "",
  entryPoints: [],
  sourcemap: "inline",
  target: "es6",
  minify: false,
  plugins: [],
  tsconfig: undefined
};

export interface EsbuildOptions extends BuildOptions {
  skipNodeModulesBundle?: boolean;
}

// 获取esbuild配置
export function getEsbuildConfig(esbuildOptions: EsbuildOptions, tsConfig: ParsedCommandLine, tsConfigFile: string) {
  const { sourceMap, inlineSources, inlineSourceMap } = tsConfig.options;

  const esbc: EsbuildOptions = Object.assign({}, defEsbuildOptions);
  const entryPoints = (esbuildOptions?.entryPoints as string[]) || [];
  esbc.entryPoints = [...tsConfig.fileNames, ...entryPoints];

  //
  esbc.target = esbuildOptions?.target || tsConfig?.raw?.compilerOptions?.target || "es6";

  //
  esbc.minify = esbuildOptions?.minify || false;
  esbc.plugins = esbuildOptions?.plugins || [];

  //
  esbc.tsconfig = tsConfigFile;

  //
  let _sourceMap: boolean | "inline" | "external" | "both" | undefined = sourceMap;
  if (inlineSources && !inlineSourceMap && !sourceMap) {
    _sourceMap = false;
  } else if (sourceMap && inlineSourceMap) {
    _sourceMap = false;
  } else if (inlineSourceMap) {
    _sourceMap = "inline";
  }
  esbc.sourcemap = _sourceMap;

  return esbc;
}
