
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./microsoft-identity-express.cjs.production.min.js')
} else {
  module.exports = require('./microsoft-identity-express.cjs.development.js')
}
