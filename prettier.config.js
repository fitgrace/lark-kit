/**
 * Description【作用描述】
 *    配置 Prettier
 *
 */


const prettierConfig = {
  'printWidth': 80,

  'tabWidth': 2,

  'useTabs': false,

  'semi': true,

  'singleQuote': true,

  'jsxSingleQuote': false,

  'trailingComma': 'all',

  'bracketSpacing': true,

  'jsxBracketSameLine': false,

  'alwaysParens': 'avoid',

  'overrides': [
    {
      'files': '*.{j,t}s?(x)',
      'options': { 'parser': 'babel' }
    },
    {
      'files': '*.css',
      'options': { 'parser': 'css' }
    }
  ]
};


module.exports =  prettierConfig;
