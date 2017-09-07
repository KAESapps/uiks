const repeat = require("./repeat")
const group = require("./group")
const swap = require("./swap")
const component = require("./ctx-level-helpers/component")
const style = require("reaks/style")

module.exports = (item, emptyView) =>
  swap(ctx => () =>
    ctx.value().length
      ? group([
          component(style)({
            flexDirection: "column",
          }),
          repeat(ctx => ctx.value, item),
        ])
      : emptyView
  )
