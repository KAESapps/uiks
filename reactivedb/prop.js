const create = require("lodash/create")
const propQuery = require("./propQuery")
const valueLoadingAs = require("./valueLoadingAs")

module.exports = function(prop, opts, view) {
  if (arguments.length === 2) {
    view = opts
    opts = { as: "value" }
  }
  const { as: ctxProp } = opts
  const query = propQuery(prop)
  return ctx => {
    const getValue = valueLoadingAs(null, query)(ctx)
    return view(create(ctx, { [ctxProp]: getValue }))
  }
}
