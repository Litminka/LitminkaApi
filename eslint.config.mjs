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
        ignores: [
            '**/*/config.ts',
            '**/*/config.js',
            'src/**/*.js',
            'tests',
            'dist',
            'coverage',
            'node-modules'
        ]
    },
    {
        files: ['src/**/*.ts'],
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
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto'
                }
            ],
            camelcase: [
                'error',
                {
                    properties: 'always',
                    ignoreImports: true
                }
            ],
            'no-constant-condition': ['error', { checkLoops: false }],
            'arrow-body-style': ['error', 'always'],
            'no-warning-comments': ['warn'],
            'no-var': ['error'],
            '@typescript-eslint/no-explicit-any': ['warn'],
            '@typescript-eslint/no-unused-vars': ['warn']
        }
    }
);
