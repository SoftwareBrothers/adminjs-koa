module.exports = {
  env: {
    browser: true,
    es2020: true,
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
    ecmaVersion: 20,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: ['error', 'never'],
    'no-unused-vars': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    indent: [
      'error',
      2,
    ],
    'linebreak-style': ['error', 'unix'],
    'object-curly-newline': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
