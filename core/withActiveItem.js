const { observable } = require("reactivedb/obs")
const create = require("lodash/create")
const isString = require("lodash/isString")
const upperFirst = require("lodash/upperFirst")

module.exports = (opts, view) => ctx => {
  if (!view) {
    view = opts
    opts = "activeItem"
  }
  if (isString(opts)) {
    opts = {
      prop: opts,
    }
  }
  const { prop = "activeItem", defaultValue = null } = opts
  const activeItem = observable(defaultValue, prop)
  return view(
    create(ctx, { [prop]: activeItem, [`set${upperFirst(prop)}`]: activeItem })
  )
}
