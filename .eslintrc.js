module.exports = {
  env: {
    browser: true,
    es2020: true,
    'cypress/globals': true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '*/build/**/*',
    '*.json',
    '*.txt',
    'yarn.lock',
    '*.yaml',
    'node_modules',
    '*.log',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'cypress',
    '@typescript-eslint',
  ],
  rules: {
    semi: ['error', 'never'],
    'no-unused-vars': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'react/jsx-filename-extension': 'off',
    indent: [
      'error',
      2,
    ],
    'linebreak-style': ['error', 'unix'],
    'object-curly-newline': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [{
    files: ['*.tsx'],
    rules: {
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
    },
  }],
}
