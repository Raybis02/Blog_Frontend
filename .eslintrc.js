module.exports = {
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  rules: {
    'indent': ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/prop-types': 'off',
    'no-console': 'warn',
    'prettier/prettier': ['error', {
      'singleQuote': true,
      'semi': true,
      'trailingComma': 'all',
      'printWidth': 80,
    }],
    'react/button-has-type': 'off',
  },
};
