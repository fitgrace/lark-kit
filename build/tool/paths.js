const path = require('path')

// 根目录
const root = path.resolve(__dirname, './')

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
  publicPath,
  root
}
