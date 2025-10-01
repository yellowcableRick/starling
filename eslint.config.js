// @ts-check
import eslint from "@eslint/js";
// noinspection SpellCheckingInspection
import tseslint from "typescript-eslint";
import globals from "globals";
import vuePlugin from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import jsonPlugin from "eslint-plugin-jsonc";
import jsonParser from "jsonc-eslint-parser";

export default [
    // Base JS + TS
    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    // Vue plugin
    {
        files: [
            "**/*.vue",
            "**/*.{ts,js}",
            "nuxt.config.ts",
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021
            },
            parser: tsParser // ✅ must be the imported object
        },
        plugins: {
            vue: vuePlugin
        },
        rules: {
            // Vue recommended rules
            "vue/no-unused-vars": "warn",
            "vue/require-name-property": "error",
            "vue/multi-word-component-names": "off",

            // TS + JS rules
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "semi": ["warn", "always"],
            "quotes": ["warn", "double"],
            "indent": ["warn", 4]
        }
    },

    // Nuxt-free modules (framework-agnostic)
    {
        files: ["modules/**/*.ts"],
        rules: {
            "no-restricted-imports": ["error", {
                paths: [
                    "nuxt",
                    "nuxt/config",
                    "@nuxt/kit",
                    "#app",
                    "#imports"
                ],
                patterns: [
                    "nuxt/*",
                    "@nuxt/*"
                ]
            }]
        }
    },

    // JSON files linting
    {
        files: ["**/*.json"],
        languageOptions: {
            parser: jsonParser, // parser object
            globals: {} // optional
        },
        plugins: { jsonc: jsonPlugin },
        rules: {
            "jsonc/array-bracket-spacing": ["error", "never"],
            "jsonc/object-curly-spacing": ["error", "always"],
            "jsonc/quotes": ["error", "double"]
        }
    }
];
