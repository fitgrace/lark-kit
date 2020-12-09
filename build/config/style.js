const paths = require('../tool/paths')
const isPro = require('../tool/isPro')

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
          .options({ sourceMap: !isPro, importLoaders: 1 })
          .end()
        .use('postcss')
          .loader('postcss-loader')
          .options({
            sourceMap: !isPro 
          })
  }
}
