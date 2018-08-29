const once = require("lodash/once")
const repeat = require("./repeat")
const swap = require("reaks/swap")
const style = require("./style")

module.exports = (item, emptyView) => ctx => {
  const getEmptyView = emptyView ? once(emptyView) : () => emptyView
  const getNonEmptyView = once(
    style(
      {
        flexDirection: "column",
        flex: 1,
      },
      repeat(ctx => ctx.value, style({ flexShrink: 0 }, item))
    )
  )
  return swap(
    () => (ctx.value().length ? getNonEmptyView(ctx) : getEmptyView(ctx))
  )
}
