const paths = require('../tool/paths')
const nodeEnv = process.env.NODE_ENV || 'development'

// 文件名
const filename = nodeEnv === 'production' ? '[name].[chunkhash:8].js' : '[name].bundle.js'

module.exports = ({ config }) => {
  return () => {
    // 模式
    config.mode(nodeEnv)

    /**
     * 基础目录
     * 绝对路径，用于从配置中解析入口起点(entry point)和 loader
     * 假如入口文件 app.js 与配置文件不在同一个目录中，则需要新增配置参数告诉 webpack 去哪里找app.js
     */
    config.context(paths.src)

    // 入口
    config.entry('index')
      .add('./index.ts')
      .end()

    // 出口
    config.output
      .path(paths.outPath)
      .filename(filename)
      .publicPath(paths.publicPath)
  }
}
