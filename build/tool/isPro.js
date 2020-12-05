const nodeEnv = process.env.NODE_ENV || 'development'
const isPro = nodeEnv === 'production'

module.exports = isPro
