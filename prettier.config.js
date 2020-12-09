/**
 * Description【作用描述】
 *    配置 Prettier
 *
 */


const prettierConfig = {
  'printWidth': 80,

  'tabWidth': 2,

  'useTabs': false,

  'semi': false,

  'singleQuote': true,

  'jsxSingleQuote': false,

  'trailingComma': 'all',

  'bracketSpacing': true,

  'jsxBracketSameLine': false,

  'alwaysParens': 'avoid',

  'overrides': [
    {
      'files': '*.js',
      'options': { 'parser': 'babel' }
    }
  ]
};

module.exports =  prettierConfig;
