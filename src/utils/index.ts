import path from "path";
import fs from "fs-extra";
import glob from "globby";
import camelCase from "camelcase";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = function (relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};


export async function removeFiles(patterns: string[], dir: string) {
  const files = await glob(patterns, {
    cwd: dir,
    absolute: true
  });
  await Promise.all(files.map((file: string) => fs.promises.unlink(file)));
}


// Remove the package name scope if it exists
export const removeScope = (name: string) => name.replace(/^@.*\//, "");

// UMD-safe package name
export const safeVariableName = (name: string) => {
  return camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "")
  );
};

export const safePackageName = (name: string) => {
  return name.toLowerCase().replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "");
};

export const external = (id: string) => {
  return !id.startsWith(".") && !path.isAbsolute(id);
};

export function debouncePromise<T extends unknown[]>(fn: (...args: T) => Promise<void>, delay: number, onError: (err: unknown) => void) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  let promiseInFly: Promise<void> | undefined;

  let callbackPending: (() => void) | undefined;

  return function debounced(...args: Parameters<typeof fn>) {
    if (promiseInFly) {
      callbackPending = () => {
        debounced(...args);
        callbackPending = undefined;
      };
    } else {
      if (timeout != null) clearTimeout(timeout);

      timeout = setTimeout(() => {
        timeout = undefined;
        promiseInFly = fn(...args)
          .catch(onError)
          .finally(() => {
            promiseInFly = undefined;
            if (callbackPending) callbackPending();
          });
      }, delay);
    }
  };
}
