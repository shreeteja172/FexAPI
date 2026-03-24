import { config as baseConfig } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ["src/schema.ts"],
    rules: {
      "max-len": [
        "error",
        {
          code: 100,
          ignoreComments: true,
          ignoreStrings: false,
          ignoreTemplateLiterals: false,
          ignoreUrls: true,
        },
      ],
    },
  },
];
