const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const constant = require("lodash/constant")

module.exports = function(prop, opts, view) {
  if (arguments.length === 2) {
    view = opts
    opts = { as: "value" }
  }
  const { as: ctxProp } = opts
  return ctx => {
    const getEntity = isFunction(ctx.value) ? ctx.value : constant(ctx.value)
    const getProp = isFunction(prop) ? prop(ctx) : constant(prop)
    const getValue = () => {
      return ctx.query([{ constant: getEntity() }, { valueOfProp: getProp() }])
        .value
    }
    return view(create(ctx, { [ctxProp]: getValue }))
  }
}
