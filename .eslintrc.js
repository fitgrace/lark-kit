/**
 * Description【作用描述】
 *    ESLint 配置
 *
 */


module.exports = {
  root: true,

  extends: [
    'alloy',
    'alloy/react',
    'alloy/typescript',
    'plugin:react-hooks/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],

  env: {
    browser: true,
    es6: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },

  plugins: [
    '@typescript-eslint'
  ],

  rules: {
    'no-console': 0,
    'import/no-unresolved': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error'
  },
};
