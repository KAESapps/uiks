const once = require("lodash/once")
const repeat = require("./repeat")
const group = require("./group")
const swap = require("reaks/swap")
const component = require("./ctx-level-helpers/component")
const style = require("reaks/style")

module.exports = (item, emptyView) => ctx => {
  const getEmptyView = emptyView ? once(emptyView) : () => emptyView
  const getNonEmptyView = once(
    group([
      component(style)({
        flexDirection: "column",
      }),
      repeat(ctx => ctx.value, item),
    ])
  )
  return swap(
    () => (ctx.value().length ? getNonEmptyView(ctx) : getEmptyView(ctx))
  )
}
