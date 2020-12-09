/**
 * Description【作用描述】
 *    ESLint 配置
 *
 */


const eslintrc = {
  root: true,

  extends: [
    'airbnb-base',
    'plugin:prettier/recommended'
  ],

  env: {
    browser: true,
    es6: true,
  },

  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },

  plugins: [
    'prettier'
  ],

  rules: {
    "no-console": 0,
    'prettier/prettier': 'error'
  },
};

module.exports = eslintrc;
