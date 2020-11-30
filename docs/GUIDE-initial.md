# 定制符合自己的前端脚手架

## 介绍

开发一个新项目时，会首先搭建一个脚手架，才会开始写代码。一般脚手架都应当包含以下功能：

1. 本地开发与调试，并有热替换与热加载等
2. 检查并自动矫正不符合规范的代码，并优化代码格式
3. 自动化构建代码，如：打包、压缩、上传


## Yarn 包管理

Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。

```
// 初始化一个新项目
$ yarn init

// 添加依赖包
$ yarn add [package]
$ yarn add [package] --dev

// 升级依赖包
$ yarn upgrade [package]

// 移除依赖包
$ yarn remove [package]
```


## 起步
在开始之前，建议将 Node.js 升级到最新的长期支持版本(LTS - Long Term Support)

```
// 创建一个新目录，并进入这个目录
$ mkdir lark-kit
$ cd lark-kit

// 项目初始化
$ yarn init

// 初始化会生成文件 package.json
{
  "name": "lark-kit",
  "version": "1.0.0",
  "description": "This is a front-end development kit",
  "repository": {
    "type": "git",
    "url": "https://github.com/fitgrace/lark-kit"
  },
  "author": "FitGrace",
  "license": "MIT",
  "private": true
}

// 目录结构规划
lark-kit
│── build  // webpack 配置
│── docs   // 文档
│── src    // 源码
│── static // 构建输出
└── package.json
```


## webpack 安装
建议进行本地安装。这可以使我们在引入破坏式变更(breaking change)的依赖时，更容易分别升级项目。

```
// 安装 webpack
$ yarn add webpack --dev

// 接着安装 webpack-cli（此工具用于在命令行中运行 webpack）
$ yarn add webpack-cli --dev

// 打开 package.json 文件，并添加一个构建脚本
"scripts": {
  "dev": "webpack"
}
```

创建 src 文件夹，并且新建一个文件 index.js 并且输入内容
```
$ mkdir src

// index.js
console.log('Hello lark kit ~');
```

运行 yarn dev，可以看到编译成功，项目目录下多出一个 dist 文件夹，我们事先也并没有配置 output 输出指向，Webpack 默认将 bundle 好的内容，放在了 dist 文件夹内。


## Webpack 模式

Mode 是 Webpack 4 新增的参数选项，其有两个可选值：production 和 development。

mode 不可缺省，需要二选一。

修改 package.json 文件，在其中包含模式标志
```
"scripts": {
  "dev": "NODE_ENV=development webpack"
}
```

通过上面的配置，我们就可以在业务代码中通过 process.env.NODE_ENV 拿到环境变量值，如：

```javascript
const nodeEnv = process.env.NODE_ENV || 'development'

// webpack.config.js
module.exports = {
  mode: nodeEnv
}
```

当使用 NODE_ENV=development 来设置环境变量时，Windows 会报错，Windows 不支持 NODE_ENV=development 的设置方式。

借助 cross-env，这个迷你包(cross-env)能够提供一个设置环境变量的 scripts，让你能够以 unix 方式设置环境变量，在 Windows 上也能兼容运行。

```
// 安装 cross-env
$ yarn add cross-env --dev


// 使用 cross-env
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack"
}
```


## 搭建开发环境和生产环境
开发环境(development)和生产环境(production)的构建目标差异很大。由于要遵循逻辑分离，建议为每个环境编写彼此独立的 webpack 配置。而“通用”配置，可以使我们不必在环境特定的配置中重复代码。

webpack 配置目录结构：
```
lark-kit
│── build
│   │── config
│   │   │── base.js // 基础配置
│   │   └── htmlWebpackPlugin.js  // HTML 配置
│   │── tool
│   │   └── paths.js  // 路径定义
│   │── base.js  // 公共配置
│   │── build.js // 生产
│   └── dev.js   // 开发
│── docs
│── src
│   │── index.html // HTML 模板
│   └── index.js // 主入口
│── config.js // 服务器相关
└── package.json
```

我们用 webpack-chain 编写 webpack 的配置，原因是 webpack-chain 的方式更加灵活。这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。

官方解释
```
webpack-chain 尝试通过提供可链式或顺流式的 API 创建和修改 webpack 配置。API 的 Key 部分可以由用户指定的名称引用，这有助于跨项目修改配置方式的标准化。
```


首先安装 webpack-chain

```bash
$ yarn add webpack-chain --dev
```

### 实现可插拔配置

运行 webpack 时用 --config 命令指定使用的配置文件

```
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack --config build/dev.js",
  "build": "cross-env NODE_ENV=production webpack --config build/build.js"
}
```

#### 路径定义 build/tool/paths.js
```javascript
const path = require('path')

// 基础目录
const src = path.resolve(__dirname, '../../src')

// 发布输出地址
const outPath = path.resolve(__dirname, '../../static/')

// 静态文件发布地址
const cdn = ''
const publicPath = `${cdn}/static/`

module.exports = {
  src,
  outPath,
  publicPath
}
```

#### 基础配置 build/config/base.js

```javascript
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
      .add('./index.js')
      .end()

    // 出口
    config.output
      .path(paths.outPath)
      .filename(filename)
      .publicPath(paths.publicPath)
  }
}
```


#### HTML 自动生成

Html-Webpack-Plugin 是 Webpack 常用的用于生成静态html页面的插件，它内部使用的默认模板引擎为 Lodash.template。但它也提供了使用第三方模板引擎的方式，使用相应的 webpack-loader 即可。

首先安装 html-webpack-plugin

```bash
$ yarn add html-webpack-plugin@next --dev
```

src/index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="This is a front-end development kit">
    <meta name="keywords" content="lark-kit,frontend,fitgrace">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
  </body>
</html>
```

build/config/htmlWebpackPlugin.js

```javascript
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
```

#### 公共配置 build/base.js

```javascript
const fs = require('fs')
const path = require('path')
const Config = require('webpack-chain')
const config = new Config()

module.exports = () => {
  const configs = []

  const configPath = path.join(__dirname, './', 'config')
  const files = fs.readdirSync(configPath)
  files.forEach(fileName => configs.push(require(`${configPath}/${fileName}`)))

  configs.forEach(x => x({ config })())

  return config
}
```


#### 构建开发环境（devServer）

webpack-dev-server 为我们在开发的时候提供了一个服务器以便于我们的开发，可以监听入口文件和其它被它引用（导入）的文件，并在文件更新的时候，通知浏览器刷新网页。

首先安装 webpack-dev-server

```bash
$ yarn add webpack-dev-server --dev
```

安装完成之后我们需要在 build/dev.js 配置中配置 devServer 选项：

```javascript
const paths = require('./tool/paths')
const proxyConfig = require('./../config.js')
const serverPath = process.env.SERVER_PATH
const server = proxyConfig[serverPath] || proxyConfig['DEFAULT']
const target = server.apiUrl
const PORT = server.PORT || 8080
const local = `http://localhost:${PORT}`

const config = require('./base')()

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
```

最佳编写实践

- colors：使用颜色，有利于找出关键信息，只能在控制台中使用
- hot：启用热替换属性
- info：在控制台输出信息，默认输出
- open：运行命令之后自动打开浏览器
- progress：将运行进度输出到控制台，只可以使用控制台
- profile：添加打包的信息，可以通过Analyzer分析，在控制台输出

以上的命令大部分在大部分情况下只会用到很少一部分，并且以上的很多命令都是可以在配置中声明或者在控制台声明的，推荐和开发体验相关的，如 hot、open、progress、colors 等通过命令行来写，并且写在 package.json 配置：

```
"scripts": {
  "start": "cross-env NODE_ENV=development webpack-dev-server  --open --hot --colors --progress --profile --config build/dev.js"
}
```
