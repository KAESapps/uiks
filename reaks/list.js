const repeat = require("./repeat")
const swap = require("./swap")
const style = require("./style")

module.exports = (item, emptyView) =>
  swap(ctx => () =>
    ctx.value().length
      ? style(
          {
            flexDirection: "column",
          },
          repeat(ctx => ctx.value, style({ flexShrink: 0 }, item))
        )
      : emptyView
  )
