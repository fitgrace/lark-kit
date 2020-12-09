# JS，配置 ES6 开发环境

实际项目中很有可能会使用 ES6 语法模块，但一些浏览器对于 ES6 语法的支持并不完善。需要使用转换工具把 ES6 语法转换为 ES5 语法，babel 就是最常用的一个工具。

```
/**
 * 安装
 */
$ yarn add babel-loader @babel/core @babel/preset-env --dev
```

这三个文件都是必需的，但彼此的作用各不相同

* babel-loader：作用同其他 loader 一样，实现对特定文件类型的处理
* babel-core：作用在于提供一系列 api，当 webpack 使用 babel-loader 处理文件时，babel-loader 实际上是调用了 babel-core 的 api，因此也必须安装 babel-core
* babel-preset-env：作用是告诉 babel 使用哪种转码规则进行文件处理

事实上 babel 有几种规则都可以实现对 ES6 语法的转码，如 babel-preset-es2015、babel-preset-latest、babel-preset-env，不过官方现已建议采用 babel-preset-env。

配置 babel 规则，我们建议使用 babel.config.js 格式，Babel 自身也在使用。

```javascript
/**
 * 配置介绍
 * - presets ：是某一类 plugin 的集合，包含了某一类插件的所有功能
 * - plugin ： 将某一种需要转化的代码，转为浏览器可以执行代码
 *
 * 编译的执行顺序
 * - 执行 plugins 中所有的插件
 * - plugins 的插件，按照顺序依赖编译
 * - 所有 plugins 的插件执行完成，在执行 presets 预设
 * - presets 预设，按照倒序的顺序执行。(从最后一个执行)
 * - 完成编译
 *
 */

const presets = []
const plugins = []

module.exports =  { presets, plugins }
```

## 通过 webpack 配置文件使用 babel-loader：build/config/javascript.js

```javascript
const paths = require('../tool/paths')

module.exports = ({ config }) => {
  return () => {
    config.module
      .rule('js')
        .test(/\.js$/)
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
```

cacheDirectory ： 默认值是 false。当设置了这个值时，指定的目录将会用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免每次都执行时，产生高性能消耗的编译过程。如果提供的是空值或者传入true，那么 loader 使用默认的缓冲目录 node_modules/.cache/babel-loader，如果没有找到 node_modules 将会往上一级查找。


### ESLint

ESLint 是一个插件化的 JavaScript 代码检测工具，它可以用于检查常见的 JavaScript 代码错误，也可以进行代码风格检查，我们可以指定一套 ESLint 配置应用到项目上，从而实现辅助编码规范的执行，有效控制项目代码的质量。

在开始使用 ESLint 之前，先来安装它：

```javascript
$ yarn add eslint eslint-loader --dev
```

安装之后，我们可以再 webpack 配置中使用 eslint 了，只有开发环境需要进行代码检查，所以在开发环境配置文件增加如下配置，修改：build/dev.js

```javascript
config.module
  .rule('js')
    .test(/\.js$/)
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
```

我们可以在 webpack 配置文件中指定检测规则，也可以遵循最佳实践在一个专门的文件中指定检测规则。我们就采用后面的方式，在根目录下新建 .eslintrc.js 文件（详细规则可参考 docs 目录下 ESLint-config.md 文件）：

```javascript
// .eslintrc.js
module.exports = {
  root: true,

  parserOptions: {
    sourceType: 'module'
  },

  env: {
    browser: true,
  },
}
```

由于项目使用了es6，为了兼容性考虑又使用 babel 插件对代码进行了编译。而用 babel 编译后的代码使用 babel-eslint 解析器可以避免不必要的麻烦。

```javascript
// babel-eslint 安装
$ yarn add babel-eslint --dev


// .eslintrc.js
module.exports = {
  root: true,

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module'
  },

  env: {
    browser: true,
  },
}
```

编码规范就是指导如何编写和组织代码的一系列标准。编码规范可以使新开发人员快速掌握代码，然后编写出其他开发人员可以快速轻松理解的代码！

```javascript
// 安装
$ yarn add eslint-config-airbnb-base eslint-plugin-import --dev

// 如果项目基于 react
$ yarn add eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y --dev


// .eslintrc.js
module.exports = {
  root: true,

  extends: [
    'airbnb-base'

    // 项目基于 react
    // 'airbnb'
  ],

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module'
  },

  env: {
    browser: true,
  },
}
```

### Prettier

Prettier是一个能够完全统一你和同事代码风格的利器，Prettier 能够让你节省出时间来写更多的 Bug（不对，是修更多的 Bug），并且统一的代码风格能保证代码的可读性。

```javascript
// 安装 Prettier
$ yarn add prettier eslint-plugin-prettier --dev


// .eslintrc.js
module.exports = {
  // ...

  plugins: [
    'prettier'
  ],

  rules: {
    'prettier/prettier': 'error'
  }
}
```

借助 ESLint 的 autofix 功能，在保存代码的时候，自动将抛出 error 的地方进行 fix。因为我们项目是在 webpack 中引入 eslint-loader 来启动 eslint 的，所以我们只要稍微修改 webpack 的配置，就能在启动 webpack-dev-server 的时候，每次保存代码同时自动对代码进行格式化。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        /**
         * enforce: 'pre' 表示预处理
         * 因为我们只是希望 eslint 来审查我们的代码，并不是去改变它，
         * 在真正的 loader(比如：vue-loader)发挥作用前用 eslint 去检查代码。
         */
        enforce: 'pre',
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
    ]
  }
}
```

如果与已存在的插件冲突怎么办

通过使用 eslint-config-prettier 配置，能够关闭一些不必要的或者是与 prettier 冲突的 lint 选项。这样我们就不会看到一些 error 同时出现两次。使用的时候需要确保，这个配置在 extends 的最后一项。

```javascript
$ yarn add eslint-config-prettier --dev

//.eslintrc.js
module.exports = {
  // ...

  extends: [
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
}
```

在根目录创建 prettier.config.js 文件，在其中添加 Prettier 规则

```javascript
module.exports = {
  // 一行的字符数，如果超过会进行换行，默认为80
  'printWidth': 80,

  // 一个 tab 代表几个空格数
  'tabWidth': 2,

  // 是否使用 tab 进行缩进，默认为 false，表示用空格进行缩进
  'useTabs': false,

	// 行尾是否使用分号，默认为true
  'semi': true,

  // 字符串是否使用单引号，默认为false，使用双引号
  'singleQuote': true,

  // 在 JSX 中使用单引号而不是双引号
  'jsxSingleQuote': false,

	// 是否使用尾逗号，有三个可选值'<none | es5 | all>'
  'trailingComma': 'all',

	// 对象的括号和文本间是否需要空格，默认为true，效果：{ foo: bar }
  'bracketSpacing': true,

  /**
   * 将多行 JSX 元素的 > 放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）。
   */
  'jsxBracketSameLine': false,


  /**
   * 为单行箭头函数的参数添加圆括号，默认：avoid
   * avoid  - 尽可能不添加圆括号，示例：x => x
   * always - 总是添加圆括号，示例： (x) => x
   */
  'alwaysParens': 'avoid',

  // 代码的解析引擎
  'overrides': [
    {
      'files': '*.js',
      'options': { 'parser': 'babel' }
    }
  ]
}
```
