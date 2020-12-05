# 浏览器兼容性 Browserslist

Browserslist 是一个前端项目配置工具，功能是在前端工具之间共享目标环境的浏览器信息。

在现代前端项目中，我们会使用 Babel 来转换 ES6 语法、使用 AutoPrefixer, PostCSS 来转换 CSSNext 语法、使用 ESLint 来保证代码质量和规范。所以一般在前端项目中会使用下面常用的工具：

* Autoprefixer
* Babel
* postcss-preset-env
* postcss-normalize
* ESLint 的 eslint-plugin-compat
* Stylelint 的 stylelint-no-unsupported-browser-features

这些工具会根据配置的目标浏览器环境来决定使用那些策略来处理你的源代码。

Babel 在转换时会根据目标浏览器信息加入特殊的 Plugins 或 Polyfills，同样 Autoprefixer ，postcss-preset-env ，postcss-normalize ，ESLint 的 eslint-plugin-compat ，Stylelint 的 stylelint-no-unsupported-browser-features 工具也提供同样的配置。

但所有这样工具都有自己的配置信息，这样很可能会导致工具之间读取的配置信息是不一致的。

## Browserslist 是一个好注意

Browserslist 的出现就是为了解决工具之间各自为战的情况，可以提供统一的配置。即共享项目中的目标浏览器环境信息。

## 使用方法

1. 在项目根目录添加一个 .browserlistrc 文件来配置, 每一行都是一个 query, # 用来注释。

```
last 1 version
> 1%
not dead
```

2. 在项目中的 package.json 文件中添加一个 broserslist 项也可以完成配置，每一个元素都是一个 query。

```javascript
{
  "browserslist": [
    "last 1 version",
    "> 1%",
    "not dead"
  ]
}
```

## 最佳实践

* 直接选择支持的浏览器（如：last 2 Chrome versions），如果你的项目仅支持某个浏览器。之前见过公司的内部系统仅支持 Chrome 浏览器，就可以使用这个 query 啦。
* 如果要 Override 默认配置，可以通过组合 last 1 version, not dead , > 0.2% (or > 1% in US, > 1% in my stats). 来实现。
* 不要删除你不了解的浏览器。Opera Mini 在非洲的用户超过 10 亿比 Edge 的全球市场份额还大。QQ 浏览器在中国的份额超过 Firefox 和 Safari 的总合。

## 查询条件列表(常用)
* &gt; 1%：全球超过1%人使用的浏览器
* &gt; 5% in US：指定国家使用率覆盖
* last 2 versions：所有浏览器兼容到最后两个版本根据CanIUse.com追踪的版本
* Firefox ESR：火狐最新版本
* Firefox > 20：指定浏览器的版本范围
* not ie <=8：方向排除部分版本
* Firefox 12.1：指定浏览器的兼容到指定版本
* unreleased versions：所有浏览器的beta测试版本
* unreleased Chrome versions：指定浏览器的测试版本
* since 2013：2013年之后发布的所有版本
* dead：通过last 2 versions筛选的浏览器版本中，全球使用率低于0.5%并且官方声明不在维护或者事实上已经两年没有再更新的版本。
* defaults：默认配置> 0.5%, last 2 versions, Firefox ESR, not dead

## 结论

当你使用 Browserslist 配置好支持的浏览器后，那么 Babel, PostCSS, ESLint 等工具就可以为你提供一致的服务了。
