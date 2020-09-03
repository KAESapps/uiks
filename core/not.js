const isFunction = require("lodash/isFunction")

module.exports = valueArg => ctx => {
  const ctxValue = valueArg(ctx)
  if (isFunction(ctxValue)) return () => !ctxValue()
  else return !ctxValue
}
