const create = require("lodash/create")
const propQuery = require("./propQuery")
const valueLoadingAs = require("./valueLoadingAs")
const noop = () => {}

module.exports = function (prop, opts, view) {
  if (arguments.length === 2) {
    view = opts
    opts = {}
  }
  const { as: ctxProp = "value", loadingValue = null } = opts
  const query = propQuery(prop)
  return ctx => {
    const getValue = valueLoadingAs(loadingValue, query)(ctx)
    return view(create(ctx, { [ctxProp]: getValue, setValue: noop }))
  }
}
