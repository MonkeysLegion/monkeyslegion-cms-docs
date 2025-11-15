const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

module.exports = [
    ...compat.extends("next/core-web-vitals"),
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                // project: "./tnsconfig.json",
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
        },
        plugins: { "@typescript-eslint": tsPlugin, import: importPlugin },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "react-hooks/exhaustive-deps": "off",
        },
    },
    {
        files: ["**/*.{js,jsx}"],
        plugins: { react: reactPlugin },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-key": "error",
            "no-console": "warn",
            "no-unused-vars": "error",
            "no-undef": "error",
            "no-useless-escape": "warn",
        },
    },
    {
        ignores: [
            "tailwind.config.js",
            "postcss.config.js",
            "next.config.js",
            "scripts/**",
            "**/node_modules/**",
            "**/.next/**"
        ],
    },
];