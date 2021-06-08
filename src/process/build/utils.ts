import path from "path";
import fs from "fs-extra";
import { safePackageName } from "../../utils";

export function cleanDist(appDist: string) {
  fs.removeSync(appDist);
}

//
export function outputCjsEntry(name: string, appDist: string) {
  const baseLine = `module.exports = require('./${safePackageName(name)}`;
  const contents = `
  'use strict'
  
  if (process.env.NODE_ENV === 'production') {
    ${baseLine}.cjs.production.min.js')
  } else {
    ${baseLine}.cjs.development.js')
  }
  `;
  return fs.outputFile(path.join(appDist, "index.js"), contents);
}
