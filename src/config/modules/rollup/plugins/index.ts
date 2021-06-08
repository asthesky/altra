import path from "path";
import typescript from "typescript";
import autoprefixer from "autoprefixer";

import aliasPlugin from "@rollup/plugin-alias";

import postcssPlugin from "rollup-plugin-postcss";
import replacePlugin from "@rollup/plugin-replace";
import commonjsPlugin from "@rollup/plugin-commonjs";
import jsonPlugin from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";

import { terser } from "rollup-plugin-terser";
import typescriptPlugin from "rollup-plugin-typescript2";
// import { babelPlugin } from "./babel";

import { safeVariableName } from "../../../../utils";

import type { Plugin } from "rollup";
import type { AltraConfigs, FromatType } from "../../../index";

const extensions = [".ts", ".js", ".tsx", ".jsx", ".json"];

export default function createPlugins(config: AltraConfigs, format: FromatType) {
  const plugins: Plugin[] = [];

  if (config.aliasOptions) {
    plugins.push(aliasPlugin(config.aliasOptions));
  }

  //
  plugins.push(
    resolvePlugin({
      extensions,
      preferBuiltins: false
    })
  );

  //
  plugins.push(
    postcssPlugin({
      inject: false,
      extract: path.join(config.distDir, `${safeVariableName(config.name)}.css`),
      ...config.postcssOptions,
      plugins: Array.isArray(config.postcssOptions?.plugins) ? [autoprefixer()].concat(config.postcssOptions?.plugins || []) : [autoprefixer()]
    })
  );

  //
  plugins.push(
    commonjsPlugin({
      include: [/node_modules/],
      extensions: [".js", ".cjs"]
    })
  );

  //
  plugins.push(
    jsonPlugin({
      preferConst: true,
      namedExports: true
    })
  );

  //
  plugins.push(
    typescriptPlugin({
      typescript: typescript,
      tsconfig: config.tsconfigFile,
      tsconfigDefaults: {
        exclude: [
          // all TS test files, regardless whether co-located or in test/ etc
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/*.spec.tsx",
          "**/*.test.tsx",
          // TS defaults below
          "node_modules",
          "bower_components",
          "jspm_packages",
          config.distPath
        ],
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          jsx: "react"
        }
      },
      tsconfigOverride: {
        compilerOptions: {
          // TS -> esnext, then leave the rest to babel-preset-env
          target: "esnext",
          // don't output declarations more than once
          ...(format == "cjs" ? { declaration: false, declarationMap: false } : {})
        }
      },
      check: !config.compilerOnly && format == "cjs",
      useTsconfigDeclarationDir: Boolean(config.tsconfig?.declarationDir)
    })
  );

  //
  // plugins.push(
  //   babelPlugin({
  //     exclude: "node_modules/**",
  //     extensions: [...extensions, "ts", "tsx"],
  //     babelHelpers: "bundled"
  //   })
  // );

  //
  plugins.push(
    replacePlugin({
      "process.env.NODE_ENV": JSON.stringify(config.env),
      preventAssignment: true
    })
  );

  //
  if ((config.env = "production")) {
    plugins.push(
      terser({
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 10
        },
        ecma: 5,
        toplevel: format === "cjs"
      })
    );
  }

  return plugins;
}
