import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginSecurity from "eslint-plugin-security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
      ".agents/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  pluginSecurity.configs.recommended,
  {
    rules: {
      // Static typed array indexing inside verified bounds/enums in TS generates frequent false positives
      "security/detect-object-injection": "off",
    },
  },
];

export default eslintConfig;
