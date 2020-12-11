const create = require("lodash/create")
const swap = require("reaks/swap")

module.exports = (arg1, arg2) => {
  const ctxProp = arg2 ? arg1 : "value"
  const { loaded, loading, staticValue = false } = arg2 ? arg2 : arg1

  return ctx => {
    const dynamicCmp =
      !staticValue &&
      loaded(create(ctx, { [ctxProp]: () => ctx[ctxProp]().value }))
    return swap(() =>
      ctx[ctxProp]().loaded
        ? staticValue
          ? loaded(
              create(ctx, {
                [ctxProp]: ctx[ctxProp]().value,
              })
            )
          : dynamicCmp
        : loading && loading(ctx)
    )
  }
}
