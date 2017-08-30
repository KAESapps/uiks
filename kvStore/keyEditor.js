const create = require('lodash/create')
const isFunction = require('lodash/isFunction')

module.exports = ({store, key}, view) => ctx => {
  const kvStore = isFunction(store) ? store(ctx) : store
  const getKey = isFunction(key) ? key(ctx) : key
  const value = () =>
    kvStore.getValue(isFunction(getKey) ? getKey() : getKey)
  const setValue = newValue => {
    const k = isFunction(getKey) ? getKey() : getKey
    return kvStore.setValue(k, newValue)
  }
  return view(create(ctx, { value, setValue }))
}
