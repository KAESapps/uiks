const style = require("./style")
const repeat = require("./repeat")
const contextualize = require("./ctx-level-helpers/contextualize")

module.exports = (opts, item) => {
  if (!item) {
    item = opts
    opts = {}
  }
  return ctx => {
    const { gap, minWidth = 100 } = contextualize(opts, ctx)

    return style(
      {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap: gap && `${gap}px`,
      },
      repeat(ctx => ctx.value, item)
    )(ctx)
  }
}
