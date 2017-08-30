const create = require('lodash/create')
const isFunction = require('lodash/isFunction')

module.exports = ({ entity = 'value', prop }, view) => ctx => {
  const getEntity = isFunction(entity) ? entity(ctx) : entity
  const getProp = isFunction(prop) ? prop(ctx) : prop
  const value = () =>
    ctx.model.query([
      { constant: isFunction(getEntity) ? getEntity() : getEntity },
      { valueOfProp: isFunction(getProp) ? getProp() : getProp },
    ])
  const setValue = newValue => {
    const entity = isFunction(getEntity) ? getEntity() : getEntity
    const prop = isFunction(getProp) ? getProp() : getProp
    return ctx.model.patch({
      [entity]: {
        [prop]: newValue,
      },
    })
  }
  return view(create(ctx, { value, setValue }))
}
