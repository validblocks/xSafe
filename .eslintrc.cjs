module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'function-paren-newline': 'off',
    'no-bitwise': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'no-plusplus': 'off',
    'operator-linebreak': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'import/extensions': [1, 'never', { svg: 'always' }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'react/jsx-boolean-value': 1,
    'react/jsx-props-no-spreading': 0,
    'no-restricted-syntax': 0,
    'object-curly-newline': 'off',
    'react/jsx-curly-brace-presence': [1, 'ignore'],
    '@typescript-eslint/no-use-before-define': 2,
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/type-annotation-spacing': 2,
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    'react/display-name': 'off',
    'react/jsx-curly-newline': 'off',
    'react/function-component-definition': [
      0,
      // {
      //   namedComponents: 'arrow-function',
      //   unnamedComponents: 'arrow-function',
      // },
    ],
    // Typescript and will take care of this
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 0,
    // doesn't play well with typescript enums
    'no-shadow': 'off',
    semi: ['off'],
    '@typescript-eslint/semi': 'error',
    'max-len': ['warn', { code: 120 }],
    'no-param-reassign': 0,
    'class-methods-use-this': ['off'],
    'react-hooks/exhaustive-deps': 'warn',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'no-unsafe-optional-chaining': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-named-as-default': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'react/button-has-type': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/no-cycle': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
      },
    ],
  },
};
