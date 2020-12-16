const paths = require('./tool/paths')
const proxyConfig = require('./../config.js')
const serverPath = process.env.SERVER_PATH
const server = proxyConfig[serverPath] || proxyConfig['DEFAULT']
const target = server.apiUrl
const PORT = server.PORT || 8080
const local = `http://localhost:${PORT}`

const config = require('./base')()

config.module
  .rule('ts')
    .test(/\.(ts|js)x?$/)
    /**
     * enforce: 'pre' 表示预处理
     * 因为我们只是希望 eslint 来审查我们的代码，并不是去改变它，
     * 在真正的 loader(比如：vue-loader)发挥作用前用 eslint 去检查代码。
     */
    .enforce('pre')
    .include
      .add(paths.src)
      .end()
    .use('eslint')
      .loader('eslint-loader')
      .options({
        fix: true
      })

config.devtool('eval-source-map')

config.devServer
  // 指定服务器资源的根目录，如果不写入 contentBase 的值，那么 contentBase 默认是项目的目录
  .contentBase(paths.publicPath)

  // 指定开启服务的端口号
  .port(PORT)

  // 指定服务器的主机号
  .host('0.0.0.0')

  // 启用 webpack 的模块热替换特性
  .hot(true)

  // 实时刷新
  // .inline(true)

  // 是否关闭用于DNS重绑定的HTTP请求的host检查
  .disableHostCheck(true)

  // 与监视文件相关的控制选项
  .watchOptions({
    // 当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位
    aggregateTimeout: 5000,

    // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询
    poll: true,

    // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹，例如 node_modules
    ignored: /node_modules/
  })

  /**
   * 在开发单页应用时非常有用，它依赖于HTML5 history API，
   * 如果设置为true，所有的跳转将指向index.html
   * vue-router 使用 history 模式，刷新后出现 404 找不到组件，就靠这行解决
   */
  .historyApiFallback(true)

  // 控制编译的时候 shell 上的输出内容
  .stats({
    // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
    all: false,

    // `webpack --colors` 等同于
    colors: true,

    // 添加 --env information
    env: true,

    // 添加时间信息
    timings: true,

    // 添加警告
    warnings: true,

    // 添加错误信息
    errors: true 
  })

  .proxy({
    '/api/*': {
      // 请求到 '/api' 下 的请求都会被代理到 target
      target,

      /**
       * 把 http 请求中的 Origin 字段进行变换，在浏览器接收到后端回复的时候，
       * 浏览器会以为这是本地请求，而在后端那边会以为是在站内的调用
       * 必须配置为true，才能正确代理
       */
      changeOrigin: true,

      secure: false,

      // 输出请求 url
      bypass(req) {
        console.log(`${target}${req.path}`)
      }
    },
    '/': {
      target: local,
      pathRewrite: { '^/.*': `${paths.publicPath}index.html` },
      bypass(req) {
        if (/.*\..*$/.test(req.path)) return req.path
      }
    }
  })

module.exports = config.toConfig()
