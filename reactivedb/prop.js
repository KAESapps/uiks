const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const constant = require("lodash/constant")

module.exports = (prop, view) => ctx => {
  const getEntity = isFunction(ctx.value) ? ctx.value : constant(ctx.value)
  const getProp = isFunction(prop) ? prop(ctx) : constant(prop)
  const getValue = () => {
    return ctx.query([{ constant: getEntity() }, { valueOfProp: getProp() }])
      .value
  }
  return view(create(ctx, { value: getValue }))
}
