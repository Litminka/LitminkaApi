import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import parser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
    {
        ignores: ['**/*/config.ts', '**/*/config.js', 'tests']
    },
    {
        files: ['src/**/*.ts', 'src/**/*.js'],
        languageOptions: {
            parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: './'
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'warn'
        },
        rules: {
            'arrow-body-style': ['error', 'always'],
            camelcase: [
                'error',
                {
                    properties: 'always',
                    ignoreImports: true
                }
            ],
            'no-var': ['error']
        }
    }
);
