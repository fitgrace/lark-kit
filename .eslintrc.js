/**
 * Description【作用描述】
 *    ESLint 配置
 *
 */


module.exports = {
  root: true,

  extends: [
    'alloy',
    'alloy/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],

  env: {
    browser: true,
    es6: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6, // 也就是ES6语法支持的意思
    project: './tsconfig.json'
  },

  plugins: [
    '@typescript-eslint'
  ],

  rules: {
    'no-console': 0,
    'import/no-unresolved': 0,
    'prettier/prettier': 'error'
  },
};
