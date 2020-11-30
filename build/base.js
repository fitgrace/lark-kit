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
