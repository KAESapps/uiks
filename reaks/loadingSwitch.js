const swap = require("./swap")
const value = require("../core/value")

module.exports = ({ loaded, loading }) => {
  const withLoadedValueView = value(ctx => () => ctx.value().value, loaded)
  return swap(ctx => () => {
    const loadableValue = ctx.value()
    if (loadableValue.loaded) {
      return withLoadedValueView
    } else return loading
  })
}
