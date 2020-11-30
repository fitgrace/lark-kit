const HtmlWebpackPlugin = require('html-webpack-plugin')
const paths = require('../tool/paths')

module.exports = ({ config }) => {
  const title = 'Lark Kit'
  const filename = 'index.html'
  const template = 'index.html'
  const publicPath = paths.publicPath

  return () => {
    config.plugin('html')
      .use(HtmlWebpackPlugin, [{
        title,
        template,
        filename,
        publicPath,
        inject: 'body'
      }])
  }
}
