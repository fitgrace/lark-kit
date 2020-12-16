# Babel 7 下配置 TypeScript 支持

TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。

## 安装 Babel 基础

在 Babel 团队与 TypeScript 团队的合作下，Babel 7 带来了 @babel/preset-typescript，可以在不依赖 TypeScript 自己的编译器 tsc 的情况下编译 TS 代码，要使用 @babel/preset-typescript，务必确保你是 Babel7+

```
// 安装
$ yarn add @babel/core @babel/preset-env @babel/preset-typescript --dev
```

这三个都是必需的，但彼此的作用各不相同

* babel-core：作用在于提供一系列 api，当 webpack 使用 babel-loader 处理文件时，babel-loader 实际上是调用了 babel-core 的 api，因此也必须安装 babel-core
* babel-preset-env：作用是告诉 babel 使用哪种转码规则进行文件处理
* babel-preset-typescript：作用是在不依赖 typescript 自己的编译器 tsc 的情况下编译 TS 代码

事实上 babel 有几种规则都可以实现对 ES6 语法的转码，如 babel-preset-es2015、babel-preset-latest、babel-preset-env，不过官方现已建议采用 babel-preset-env。

TypeScript 有几个 Babel 需要额外特性，安装依赖
```
// 分别用于转换语法特性“类属性”、“对象展开”，二者均处于“提议”阶段
$ yarn add @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread --dev
```

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

const presets = [
  '@babel/preset-env',
  '@babel/preset-typescript'
]

const plugins = [
  '@babel/proposal-class-properties',
  '@babel/proposal-object-rest-spread'
]

module.exports =  { presets, plugins }
```

创建 tsconfig.json 文件，配置 TypeScript 编译器
```
{
  "compilerOptions": {
    "target": "esnext",
    "moduleResolution": "node",
    "allowJs": true,
    "noEmit": true,
    "strict": true,
    "isolatedModules": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

安装 babel-loader：作用同其他 loader 一样，实现对特定文件类型的处理
```
$ yarn add babel-loader --dev
```

通过 webpack 配置文件使用 babel-loader：build/config/typescript.js

```javascript
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
```

cacheDirectory ： 默认值是 false。当设置了这个值时，指定的目录将会用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免每次都执行时，产生高性能消耗的编译过程。如果提供的是空值或者传入true，那么 loader 使用默认的缓冲目录 node_modules/.cache/babel-loader，如果没有找到 node_modules 将会往上一级查找。

## 使用 ESLint 代码检查

Babel 在带来更快的编译速度的同时，也丢失了检查类型的功能，因为 Babel 处理 ts 文件时直接移除了 TypeScript，因此还需要单独配置类型检查。
```
// 安装 ESLint 的核心代码
$ yarn add eslint --dev

/** 
 * 由于 ESLint 默认使用 Espree 进行语法解析，
 * 无法识别 TypeScript 的一些语法，故我们需要安装 @typescript-eslint/parser，
 * 替代掉默认的解析器，用于解析typescript，从而检查和规范Typescript代码，
 * 别忘了同时安装 typescript
 */
$ yarn add typescript @typescript-eslint/parser --dev

// 安装插件作为 eslint 默认规则的补充，提供了了各类定义好的检测 Typescript 代码的规范
$ yarn add @typescript-eslint/eslint-plugin --dev

// eslint-config-alloy（可选）
$ yarn add eslint-config-alloy --dev
```

我们可以在 webpack 配置文件中指定检测规则，也可以遵循最佳实践在一个专门的文件中指定检测规则。我们就采用后面的方式，在根目录下新建 .eslintrc.js 文件（规则可参考 docs 目录下 ESLint-config.md 文件）：
```javascript
// .eslintrc.js
module.exports = {
  root: true,

  extends: [
    'alloy',
    'alloy/typescript',
    'plugin:@typescript-eslint/recommended'
  ],

  env: {
    browser: true,
    es6: true,
  },

  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint'
  ],

  rules: {
  },
}
```
* TS 项目中必须执行解析器为 @typescript-eslint/parser，才能正确的检测和规范 TS 代码
* env 环境变量配置，形如 console 属性只有在 browser 环境下才会存在，如果没有设置支持 browser，那么可能报 console is undefined 的错误。

### 添加忽略 eslint 配置

通过 .eslintignore 在项目的根目录中创建文件来告诉 ESLint 忽略特定的文件和目录。该 .eslintignore 文件是纯文本文件，其中每行是一个 glob 模式，指示其应忽略哪些路径。

在你的项目的根目录下创建一个 .eslintignore 文件，并将以下内容复制进去

```
# 以开头的行#被视为注释，不会影响忽略模式。
# 路径是相对于当前工作目录的。对于通过--ignore-pattern 命令传递的路径也是如此。
# 开头的行!是取反的模式，这些模式重新包含了先前模式忽略的模式。
# 忽略模式的行为符合.gitignore 规范。

# 忽略非src目录下的文件和目录
!/src
```


安装 eslint-loader
```
$ yarn add eslint-loader --dev
```

然后，我们可以在 webpack 配置中使用 eslint 了，只有开发环境需要进行代码检查，所以在开发环境配置文件增加如下配置，修改：build/dev.js

```javascript
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
```


## Prettier

Prettier是一个能够完全统一你和同事代码风格的利器，Prettier 能够让你节省出时间来写更多的 Bug（不对，是修更多的 Bug），并且统一的代码风格能保证代码的可读性。

```javascript
/**
 * 安装
 * Prettier：插件的核心代码
 * eslint-plugin-prettier：将 Prettier 作为 ESLint 规范来使用
 */
$ yarn add prettier eslint-plugin-prettier --dev
```

修改 .eslintrc.js 文件，引入 Prettier，新增的 extends 的配置中：prettier/@typescript-eslint：使得 @typescript-eslint 中的样式规范失效，遵循 Prettier 中的样式规范

```javascript
module.exports = {
  //...

  extends: [
    'alloy',
    'alloy/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint'
  ],
}
```

如果与已存在的插件冲突怎么办，通过使用 eslint-config-prettier 配置，能够关闭一些不必要的或者是与 prettier 冲突的 lint 选项。这样我们就不会看到一些 error 同时出现两次。使用的时候需要确保，这个配置在 extends 的最后一项。

```javascript
$ yarn add eslint-config-prettier --dev

//.eslintrc.js
module.exports = {
  // ...

  extends: [
    'alloy',
    'alloy/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
}
```

禁用所有与格式相关的 Stylelint 规则，解决 prettier 与 stylelint 规则冲突，确保将其放在 extends 队列最后，这样它将覆盖其他配置

```javascript
// 安装
$ yarn add stylelint-config-prettier --dev


// stylelint.config.js
module.exports = {
  // ...

  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier'
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

  /** 
   * 代码解析引擎
   * 可以通过 overrides 覆盖指定文件的配置，为某些特殊文件单独指定配置规则
   */
  'overrides': [
    {
      'files': '*.{j,t}s?(x)',
      'options': { 'parser': 'babel' }
    },
    {
      'files': '*.css',
      'options': { 'parser': 'css' }
    }
  ]
}
```

借助 ESLint 的 autofix 功能，在保存代码的时候，自动将抛出 error 的地方进行 fix。因为我们项目是在 webpack 中引入 eslint-loader 来启动 eslint 的，所以我们只要稍微修改 webpack 的配置，就能在启动 webpack-dev-server 的时候，每次保存代码同时自动对代码进行修复。

```javascript
// 修改：build/dev.js
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
```
