import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        plugins: { prettier, import: importPlugin },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "prettier/prettier": "error",
            "no-unused-vars": ["error"],
            eqeqeq: ["error", "always"],
            "no-console": "error",
            "import/order": [
                "error",
                {
                    groups: [
                        ["builtin"],
                        ["external"],
                        ["index"],
                        ["internal"],
                        ["parent"],
                        ["sibling"],
                    ],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "import/no-duplicates": "error",
            "import/first": "error",
        },
        ignores: ["node_modules/", "logs/", "dist/"],
    },
];
