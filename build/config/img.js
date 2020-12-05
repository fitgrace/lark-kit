const paths = require('../tool/paths')
const isPro = require('../tool/isPro')

module.exports = ({ config }) => {
  return () => {
    config.module
      .rule('img')
        .test(/\.(png|jpg|gif|svg)$/)
        .include
          .add(paths.src)
          .end()
        .use('img')
          .loader('url-loader')
          .options({
            /**
             * 限制打包图片的大小
             * 如果大于或等于设置值，则按照相应的文件名和路径打包图片
             * 如果小于设置值，则将图片转成 base64 格式的字符串。
             */
            limit: 100,

            /**
             * 部署时的绝对路径
             * 这样做的原因是，webpack打包时，还会将图片复制到 dist/img/1.png，
             * 但是他也会把 css 文件中的 background url 改写为  publicPath + name
             */
            publicPath: paths.publicPath,

            /**
             * name 表示输出的文件名规则，如果不添加这个参数，输出的就是默认值：文件哈希
             * 加上 [path] 表示输出文件的相对路径与当前文件相对路径相同
             * 加上 [name].[ext] 则表示输出文件的名字和扩展名与当前相同
             * 加上 [path] 这个参数后，打包后文件中引用文件的路径也会加上这个相对路径
             */
            name: `[path][name]${isPro ? '.[hash:8]' : ''}.[ext]`
          })
  }
}
