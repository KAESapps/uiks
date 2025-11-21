const { observable } = require("kobs")
const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
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
  const activeItem = observable(
    isFunction(defaultValue) ? defaultValue(ctx) : defaultValue,
    prop
  )
  return view(
    create(ctx, { [prop]: activeItem, [`set${upperFirst(prop)}`]: activeItem })
  )
}
