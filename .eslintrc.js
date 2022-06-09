module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:react/jsx-runtime",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    "import/extensions": [1, "never", { svg: "always" }],
    "react/jsx-boolean-value": 1,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-curly-brace-presence": [1, "never"],
    "@typescript-eslint/no-use-before-define": 2,
    "@typescript-eslint/type-annotation-spacing": 2,
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    "react/function-component-definition": [
      1,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    // Typescript and will take care of this
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "import/prefer-default-export": 0,
    // doesn't play well with typescript enums
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    semi: ["off"],
    "@typescript-eslint/semi": "error",
    "max-len": ["warn", { code: 120 }],
    "no-param-reassign": 0,
    "class-methods-use-this": ["off"],
    "react-hooks/exhaustive-deps": "warn",
    camelcase: "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/no-shadow": "off",
  },
  // ignore the root js config files
  ignorePatterns: ["/*.js"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: {
        map: [
          ["src", "./src"],
          ["@components", "./src/components"],
          ["@images", "./src/assets/images"],
          ["@hooks", "./src/hooks"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
};