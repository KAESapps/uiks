const { observable } = require('ks-data/obs')
const create = require('lodash/create')

module.exports = (prop, view) => ctx => {
  if (!view) {
    view = prop
    prop = 'activeItem'
  }
  const activeItem = observable(null, prop)
  return view(create(ctx, { [prop]: activeItem }))
}
