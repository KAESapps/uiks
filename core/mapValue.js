const isFunction = require("lodash/isFunction")

module.exports = (mapFn, getValue) => ctx => {
  const ctxValue = getValue(ctx)
  return isFunction(ctxValue) ? () => mapFn(ctxValue()) : mapFn(ctxValue)
}
