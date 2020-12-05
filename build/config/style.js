const paths = require('../tool/paths')
const path = require('path')

module.exports = ({ config }) => {
  return () => {
    config.module
      .rule('css')
        .test(/\.css$/)
        .include
          .add(paths.src)
          .end()
        .use('style')
          .loader('style-loader')
          .options({})
          .end()
        .use('css')
          .loader('css-loader')
          .options({ sourceMap: true, importLoaders: 1 })
          .end()
        .use('postcss')
          .loader('postcss-loader')
          .options({
            sourceMap: true
          })
  }
}
