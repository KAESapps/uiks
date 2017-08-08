const create = require('lodash/create')

module.exports = (arg, view) => ctx => {
  const value = typeof arg === 'function' ? arg(ctx) : arg
  return view(create(ctx, {value}))
}
