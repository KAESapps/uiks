const create = require("lodash/create")
const swap = require("reaks/swap")

module.exports = ({ loaded, loading, staticValue = false }) => ctx => {
  return swap(() =>
    ctx.value().loaded
      ? loaded(
          create(ctx, {
            value: staticValue ? ctx.value().value : () => ctx.value().value,
          })
        )
      : loading && loading(ctx)
  )
}
