import path from "path";

/**
 * 获取packagejson配置
 *
 * @param {string} root
 * @returns {PkgConfig}
 */

const defPkgConfig: PkgConfig = {
  type: "module"
};

export interface PkgConfig {
  name?: string;
  version?: string;
  type?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function getPkgConfig(root: string) {
  const pkgConfig = Object.assign({}, defPkgConfig);

  // 获取 altra 文件配置
  try {
    const configPath = path.resolve(root, "./package.json");
    const fileConfig = require(configPath);

    if (typeof fileConfig == "object") {
      Object.assign(pkgConfig, fileConfig);
    }
  } catch (err) {
    console.error(err);
    console.log("Using default config");
  }

  return pkgConfig;
}
