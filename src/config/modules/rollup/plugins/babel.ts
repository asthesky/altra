import { createConfigItem } from "@babel/core";
import { createBabelInputPluginFactory } from "@rollup/plugin-babel";

import type { PluginItem } from "@babel/core";

export const babelPlugin = createBabelInputPluginFactory(() => {
  return {
    // Passed the plugin options.
    options({ custom: customOptions, ...pluginOptions }: any) {
      return {
        customOptions,
        pluginOptions
      };
    },
    config(config: any, { customOptions }: any) {
      const babelOptions = config.options || {};

      const babelPresets = babelOptions.presets || [];
      const babelPlugin: PluginItem[] = [
        {
          name: "@babel/plugin-proposal-class-properties",
          loose: true
        },
        {
          name: "@babel/plugin-proposal-nullish-coalescing-operator"
        },
        {
          name: "@babel/plugin-proposal-object-rest-spread"
        },
        {
          name: "@babel/plugin-proposal-optional-chaining"
        }
      ];

      if (customOptions) {
        const presetEnvIndex = babelPresets.findIndex((preset: any) => preset.file.request.includes("@babel/preset-env"));

        // if they use preset-env, merge their options with ours
        if (presetEnvIndex > -1) {
          const presetEnv = babelPresets[presetEnvIndex];
          babelPresets[presetEnvIndex] = createConfigItem(
            [
              presetEnv.file.resolved,
              Object.assign(
                {
                  loose: true,
                  targets: customOptions.targets
                },
                presetEnv.options,
                {
                  modules: false
                }
              )
            ],
            {
              type: `preset`
            }
          );
          babelOptions.presets = babelPresets;
        } else {
          const presetEnv = createConfigItem(
            {
              name: "@babel/preset-env",
              targets: customOptions.targets,
              modules: false,
              loose: true
            },
            {
              type: `preset`
            }
          );
          babelOptions.presets = mergeConfigItems("preset", [presetEnv], babelPresets);
        }
      }

      // Merge babelrc & our plugins together
      babelOptions.plugins = mergeConfigItems("plugin", babelPlugin, babelOptions.plugins || []);

      return babelOptions;
    }
  };
});

export const mergeConfigItems = (type: any, ...configItemsToMerge: any[]) => {
  const mergedItems: any[] = [];

  configItemsToMerge.forEach((configItemToMerge) => {
    configItemToMerge.forEach((item: any) => {
      const itemToMergeWithIndex = mergedItems.findIndex((mergedItem) => mergedItem.file.resolved === item.file.resolved);

      if (itemToMergeWithIndex === -1) {
        mergedItems.push(item);
        return;
      }

      mergedItems[itemToMergeWithIndex] = createConfigItem([mergedItems[itemToMergeWithIndex].file.resolved, Object.assign(mergedItems[itemToMergeWithIndex].options, item.options)], {
        type
      });
    });
  });

  return mergedItems;
};

export const createConfigItems = (type: any, items: any[]) => {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name), options], { type });
  });
};
