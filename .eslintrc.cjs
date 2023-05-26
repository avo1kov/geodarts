module.exports = {
    root: true,
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
    plugins: [
        "@typescript-eslint",
        "react-hooks"
    ],
    parserOptions: {
        parser: "@typescript-eslint/parser"
    },
    env: {
        browser: true
    },
    ignorePatterns: [
        ".vscode/*",
        ".idea/*",
        ".yarn/*",
        "build*/*"
    ],
    rules: {
        semi: ["error", "never"],
        indent: ["error", 4],
        quotes: ["error", "double"],
        eqeqeq: ["error", "always"],
        "eol-last": ["error", "always"],
        "linebreak-style": ["error", "unix"],
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "never"],
        "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error"
    }
}
