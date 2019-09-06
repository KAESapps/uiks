const create = require("lodash/create")
const swap = require("reaks/swap")

module.exports = ({ loaded, loading, staticValue = false }) => ctx => {
  const dynamicCmp = loaded(create(ctx, { value: () => ctx.value().value }))
  return swap(() =>
    ctx.value().loaded
      ? staticValue
        ? loaded(
            create(ctx, {
              value: ctx.value().value,
            })
          )
        : dynamicCmp
      : loading && loading(ctx)
  )
}
