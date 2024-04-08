import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import parser from "@typescript-eslint/parser";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            "**/*/config.ts",
            "**/*/config.js",
            "tests",
        ],
    },
    {
        plugins: {
            tseslint,
            eslint
        },
        files: [
            "src/**/*.ts",
            "src/**/*.js",
        ],
        languageOptions: {
            parser,
            parserOptions: {
                "project": "./tsconfig.json",
                "tsconfigRootDir": "./"
            },

        },
        rules: {
            semi: "error"
        }
    }
);