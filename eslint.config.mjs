import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("plugin:@wordpress/eslint-plugin/recommended", "prettier"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jquery,
            ...globals.node,
            wp: true,
        },
    },

    rules: {
        camelcase: "warn",
        eqeqeq: "warn",
        "no-console": "warn",
        "@wordpress/no-unused-vars-before-return": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}]);