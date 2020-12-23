/**
 * Description【作用描述】
 *    配置 Babel
 *
 *    参考：
 *    https://segmentfault.com/a/1190000016311818
 *    https://www.cnblogs.com/chyingp/p/understanding-babel-preset-env.html
 *
 */


const presets = [
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-typescript'
];

const plugins = [
  '@babel/proposal-class-properties',
  '@babel/proposal-object-rest-spread'
];

module.exports =  { presets, plugins };
