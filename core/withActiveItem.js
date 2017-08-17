const { observable } = require("reactivedb/obs")
const create = require("lodash/create")
const upperFirst = require("lodash/upperFirst")

module.exports = (prop, view) => ctx => {
  if (!view) {
    view = prop
    prop = "activeItem"
  }
  const activeItem = observable(null, prop)
  return view(
    create(ctx, { [prop]: activeItem, [`set${upperFirst(prop)}`]: activeItem })
  )
}
