# Webpack 中的样式处理

为了让 Webpack 可以处理样式，我们需要安装 css 和 style 加载器，style-loader和css-loader作用是不同的
* css-loader：用于加载.css文件
* style-loader：用于将打包后的 css 代码使用 <style> 注入到 HTML 页面中

首先安装 loader
```bash
$ yarn add css-loader style-loader --dev
```

#### build/config/style.js

```javascript
const paths = require('../tool/paths')

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
  }
}
```


## css 文件中的图片处理

处理 CSS 中的图片资源时，我们常用的两种 loader 是 file-loader 或者 url-loader，两者的主要差异在于。
url-loader 可以设置图片大小限制，当图片超过限制时，其表现行为等同于 file-loader，而当图片不超过限制时，则会将图片以 base64 的形式打包进 CSS 文件，以减少请求次数。

url-loader 封装了 file-loader，url-loader 不依赖于 file-loader，即使用 url-loader 时，只需要安装 url-loader 即可，不需要安装 file-loader，因为 url-loader 内置了 file-loader

url-loader 工作分两种情况：
1. 文件大小小于 limit 参数，url-loader 将会把文件转为 DataURL
2. 文件大小大于 limit，url-loader 会调用 file-loader 进行处理，参数也会直接传给 file-loader


#### build/config/assets.js

```javascript
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
            publicPath: '../',

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
```


## PostCSS

PostCSS 并不是一门语言，而是一个类似于 webpack 的工具，它支持很多插件，通过插件机制可以灵活的扩展其支持的特性，来达到便捷的编译效果，组成一个 CSS 编译 /lint/autoprefixer 的生态圈。

PostCSS 的一大特点是，具体的编译插件甚至是 CSS 书写风格，可以根据自己的需要进行安装，选择自己需要的特性：嵌套，函数，变量，自动补全，CSS 新特性等等，而不是像 less 或者 scss 一样的大型全家桶。因此，不需要再专门去学习 less 或者 scss 的语法，只要选择自己喜欢的特性，可以只写 CSS 文件，但依旧可以写嵌套或者函数，然后选择合适的插件编译它就行了。

鉴于现在 webpack 越来越火，所以之后的配置主要是借助于 postcss-loader，将 PostCSS 的生态圈依托在 webpack 之下。

安装 loader

```bash
$ yarn add postcss-loader --dev
```

#### 修改 build/config/style.js

```javascript
const paths = require('../tool/paths')

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
  }
}
```


#### 根目录 postcss.config.js

plugins 里插件的顺序是对结果有影响的，如：把 postcss-partial-import 写在 postcss-nested 的下面，那么用 @import 导入的样式文件里的嵌套将不能正常解析，所以要注意插件的顺序

```javascript
module.exports = {
  plugins: {
    'postcss-advanced-variables': {},
    'postcss-preset-env': {},
    'postcss-partial-import': {},
    'postcss-nested': {},
  }
}
```

插件快速配置一览

```bash
# 使用一些 css 新特性，安装postcss-preset-env，无需再安装autoprefixer，postcss-preset-env 已经内置了相关功能
# 变量，运算，color function ...
$ yarn add postcss-preset-env --dev

# 嵌套
$ yarn add postcss-nested --dev

# 像 SASS 那样可以自定义变量并进行引用
# 变量，mixin，if，for，each
$ yarn add postcss-advanced-variables --dev

# 在@import css文件的时候让webpack监听并编译
$ yarn add postcss-partial-import --dev
```

### CSS 代码检查工具 Stylelint

Stylelint 插件可以让你在编译的时候就知道自己 CSS 文件里的错误，在 PostCSS 内使用(荐)

安装

```bash
$ yarn add stylelint --dev
```

修改 postcss.config.js

```javascript
module.exports = {
  plugins: {
    'stylelint': {
      // lint基础配置。没有的话则会去寻找.stylelintrc
      config: require('./stylelint.config.js'),

      // 错误时是否停止编译
      failOnError: true
    },
    'postcss-advanced-variables': {},
    'postcss-preset-env': {},
    'postcss-partial-import': {},
    'postcss-nested': {},
  }
}
```

根目录增加配置文件 stylelint.config.js

```javascript
module.exports = {
  rules: {
    // 指定一个允许使用单位的白名单
    'unit-allowed-list': ['px', '%', 'em'],

    'block-no-empty': null,
  }
}
```

这样的配置有一个很严重的缺点：如果你在js中引用了node_module里的css文件，或者引用了其他不想进行编译的文件，PostCSS会对其一视同仁的调用插件编译/检查。此时就需要我们来配置.stylelintignore以及stylelint.config.js进行更精确的编译/检查。

在项目根目录下添加.stylelintignore文件，并在内部写下不想通过PostCSS编译的文件路径：

在没有指明ignorePath的情况下，stylelint会自动寻找根目录下的.stylelintignore文件

```bash
node_modules/
```
在配置文件中指明我们的检测语法扩展插件

还安装了一个 stylelint-order 插件。该插件的作用是强制你按照某个顺序编写 css。例如先写定位，再写盒模型，再写内容区样式，最后写 CSS3 相关属性。

```javascript
// 安装 stylelint-config-standard
$ yarn add stylelint-config-standard stylelint-order --dev

// stylelint.config.js
module.exports = {
  extends: [
    'stylelint-config-standard',
  ],

  plugins: [
    'stylelint-order'
  ],

  rules: {
    // 指定一个允许使用单位的白名单
    'unit-allowed-list': ['px', '%', 'em'],

    'block-no-empty': null,

    /**
     * stylelint-order 规则
     * 参考：https://github.com/stormwarning/stylelint-config-recess-order
     */
    'order/properties-order': [
    ]
  }
}
```

此时运行webpack，有问题的CSS文件输出大概是这样的：

```bash
WARNING in ./~/css-loader!./~/postcss-loader!./frontend/stylesheet/layout/test_post_css.css
    stylelint: /Users/ecmadao1/Dev/Python/where_to_go/frontend/stylesheet/layout/test_post_css.css:17:1: Expected indentation of 2 spaces (indentation)
```

接下来安装postcss-reporter来美化输出：

```javascript
// 安装
$ yarn add postcss-reporter --dev


// postcss.config.js
module.exports = {
  // parser: 'sugarss',
  plugins: {
    'stylelint': {
      config: require('./stylelint.config.js'),
      failOnError: true
    },
    'postcss-advanced-variables': {},
    'postcss-preset-env': {},
    'postcss-partial-import': {},
    'postcss-nested': {},
    'postcss-reporter': {},
  }
}
```
