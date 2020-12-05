/**
 * Description【作用描述】
 *    PostCSS 配置项
 *
 * [+] 2020-12-03 by FitGrace
 *     plugins 里插件的顺序是对结果有影响的，
 *     如：把 postcss-partial-import 写在 postcss-nested 的下面，那么用 @import 导入的样式文件里的嵌套将不能正常解析
 *     所以要注意插件的顺序
 *
 */


const postcssConfig = {
  // parser: 'sugarss',

  plugins: {
    // 在@import css文件的时候让webpack监听并编译
    'postcss-partial-import': {},

    // 变量，mixin，if，for，each
    'postcss-advanced-variables': {},

    // CSS 新特性，变量，运算，color function ...
    'postcss-preset-env': {},

    // 代码检查
    'stylelint': {
      // lint基础配置。没有的话则会去寻找.stylelintrc
      config: require('./stylelint.config.js'),

      // 错误时是否停止编译
      failOnError: true
    },

    // 嵌套
    'postcss-nested': {},

    // 美化错误输出
    // 'postcss-reporter': {},
  }
};

module.exports = postcssConfig
