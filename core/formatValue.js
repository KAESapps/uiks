const value = require("./value")
const isFunction = require("lodash/isFunction")

module.exports = (formatter, cmp) =>
  value(
    ctx =>
      isFunction(ctx.value)
        ? () => formatter(ctx.value())
        : formatter(ctx.value),
    cmp
  )
