const modServConfig = require('./config')
const { makeMiddlewares } = require('express-module-serv')
module.exports = function makeMiddleware(config = {}) {
  config = Object.assign({}, modServConfig, config)
  return makeMiddlewares(config)
}
