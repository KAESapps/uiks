const isFunction = require("lodash/isFunction")

module.exports = (mapFn, getValue) => ctx => {
  const ctxValue = getValue ? getValue(ctx) : ctx.value
  return isFunction(ctxValue)
    ? () => {
        return mapFn(ctxValue())
      }
    : mapFn(ctxValue)
}
