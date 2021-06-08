// import { rollup } from "rollup";

import type { AltraConfigs, FromatType } from "../../index";

import createPlugins from "./plugins";

import type { RollupOptions, OutputOptions } from "rollup";

export const supportedExts = [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"];

export function getRollupConfig(config: AltraConfigs, format: FromatType): RollupOptions {
  const input = config.entry;

  const output = config.formats.map((item) => {
    const ret: OutputOptions = {
      file: `${config.distDir}/index.${item}.js`,
      name: config.name,
      sourcemap: config.sourcemap,
      exports: "named",
      banner: `/* ${config.name} version ${config.pkgConfig?.version}\n*/`
    };
    return ret;
  });

  const plugins = createPlugins(config, "es");

  return {
    input,
    //
    output,
    //
    external: [
      "/@babel/runtime/", //
      /^(vue)$/,
      /\.(scss|sass|less|css)$/
    ],
    //
    plugins,
    //
    treeshake: {
      moduleSideEffects: false
    },
    //
    preserveSymlinks: true,
    //
    onwarn(warning, warn) {
      // skip sourceMap warnings
      if (warning.message === `@rollup/plugin-typescript: Typescript 'sourceMap' compiler option must be set to generate source maps.`) return;
      // skip certain warnings
      if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
      // throw on others
      if (warning.code === "NON_EXISTENT_EXPORT") throw new Error(warning.message);
      // Use default for everything else
      warn(warning);
    }
  };
}
