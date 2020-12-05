/**
 * Description【作用描述】
 *    Stylelint 配置规则
 *
 */


const stylelintConfig = {
  extends: [
    'stylelint-config-standard',
  ],

  plugins: [
    // 'stylelint-order'
  ],

  rules: {
    // 指定一个允许使用单位的白名单
    'unit-allowed-list': ['px', 'em', 'rem', '%'],

    // 禁止空块
    'block-no-empty': null,

    /*
    'order/properties-order': [
      // Position
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',

      // Display mode
      'box-sizing',
      'display',

      // Flexible boxes
      'flex',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-wrap',

      // Box model
      'float',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
		]
    */
  }
};

module.exports = stylelintConfig;
