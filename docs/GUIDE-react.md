# React 配置

React 是一个声明式，高效且灵活的用于构建用户界面的 JavaScript 库。

安装 react 及 react-dom

```bash
$ yarn add react react-dom
```

为 React 及 JSX 安装安装声明文件

```bash
$ yarn add @types/react @types/react-dom --dev
```

首先我们需要修改一下 tsconfig.json 中的配置项

```javascript
{
  "jsx": "react"
}
```

然后我们就可以写 React 的 JSX 语法了。

写一个简单的模板组件：src/components/Hello.tsx

```javascript
import React from 'react'

interface Greeting {
  name: string
}

const Hello = (props: Greeting) => <h1>Hello { props.name }</h1>

export default Hello
```

将模板组件引入主文件，修改 index.ts

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import Hello from './components/Hello'

ReactDOM.render(
  <Hello name="TypeScript"></Hello>,
  document.getElementById('root')
)
```


尝试一下运行 yarn start，会发现打包失败了，为什么呢？

因为代码没有进行任何的处理无法直接在浏览器中运行，我们需要将 JSX 和 ES6 代码转换成浏览器中可运行的代码。

安装 @babel/preset-react 能够转换 JSX 语法

```bash
$ yarn add @babel/preset-react --dev
```

修改 babel.config.js 

```javascript
const presets = [
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-typescript'
];

const plugins = [
  '@babel/proposal-class-properties',
  '@babel/proposal-object-rest-spread'
];

module.exports =  { presets, plugins };
```

让 ESLint 能够检查 React 的语法错误

```bash
$ yarn add eslint-plugin-react --dev
```

修改 .eslintrc.js

```javascript
module.exports = {
  //...

  extends: [
    'alloy',
    'alloy/react',
    'alloy/typescript',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
};
```

如果使用 Hooks，需要注意的两点是：
* 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
* 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。）

为了避免我们无意中破坏这些规则，你可以安装一个 ESLint 插件：

```bash
$ yarn add eslint-plugin-react-hooks --dev
```

修改 .eslintrc.js

```javascript
module.exports = {
  //...

  extends: [
    //...
    'plugin:react-hooks/recommended'
  ],

  rules: {
    //...
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
  }

};
```


参考：

https://juejin.cn/post/6844904185679314958

https://lyreal666.com/从零开始配置-react-typescript（二）：linters-和-formatter/

https://www.dazhuanlan.com/2019/10/07/5d9afc003a73a/

https://zhuanlan.zhihu.com/p/104771562

https://www.dengwb.com/typescript/actual/typescript-react.html#修改tsconfig配置项

https://segmentfault.com/a/1190000007790578

https://zhuanlan.zhihu.com/p/40373319

