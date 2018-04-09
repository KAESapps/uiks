const create = require("lodash/create")
const swap = require("reaks/swap")

module.exports = ({ loaded, loading }) => ctx => {
  return swap(
    () =>
      ctx.value().loaded
        ? loaded(create(ctx, { value: () => ctx.value().value }))
        : loading && loading(ctx)
  )
}
