/**
 * ESLint flat config for the Frontend app.
 * - nextVitals / nextTs: Next.js + React + TypeScript recommended rules
 * - max-lines: 300 physical lines (comments count) — matches project policy
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "max-lines": [
        "error",
        {
          max: 300,
          skipBlankLines: false,
          skipComments: false,
        },
      ],
    },
  },
]);

export default eslintConfig;
