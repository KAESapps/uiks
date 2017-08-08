const text = require('reaks/text')
module.exports = arg => ctx => {
  const value = typeof arg === 'function' ? arg(ctx) : arg
  return text(value)
}
