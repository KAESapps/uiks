const isFunction = require("lodash/isFunction")
const constant = require("lodash/constant")

module.exports = prop => ctx => {
  const getEntity = isFunction(ctx.value) ? ctx.value : constant(ctx.value)
  const getProp = isFunction(prop) ? prop(ctx) : constant(prop)
  return () =>
    ctx.query([{ constant: getEntity() }, { valueOfProp: getProp() }])
}
