const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const mapValues = require("lodash/mapValues")

module.exports = (assingments, view) => ctx => {
  let newCtx
  if (isFunction(assingments)) {
    newCtx = create(ctx, assingments(ctx))
  } else {
    newCtx = create(
      ctx,
      mapValues(assingments, v => (isFunction(v) ? v(ctx) : v))
    )
  }
  return view(newCtx)
}
