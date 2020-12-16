const paths = require('../tool/paths')

module.exports = ({ config }) => {
  return () => {
    config.module
      .rule('ts')
        .test(/\.(ts|js)x?$/)
        /**
         * 限制范围，精确指定要处理的目录，提高打包速度
         * 最佳实践：
         * - 只在 test 和 文件名匹配 中使用正则表达式
         * - 在 include 和 exclude 中使用绝对路径数组
         * - 尽量避免 exclude，更倾向于使用 include
         */
        .include
          .add(paths.src)
          .end()
        .use('babel')
          .loader('babel-loader')
          .options({
            cacheDirectory: true // 允许缓存，加快编译速度
          })
  }
}
