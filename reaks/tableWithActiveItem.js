const table = require("./tableVirtualScroll")
const clickable = require("./clickable")
const activeStyle = require("./activeStyle")

module.exports = (arg1, arg2) =>
  table(
    {
      rowMixin: activeStyle(
        clickable.mixin(ctx => () => {
          ctx.setActiveItem(ctx.value)
          ctx.ensureItemVisible && ctx.ensureItemVisible(true)
          arg2 && arg1.next && ctx.next(arg1.next, ctx)
        })
      ),
      itemHeight: arg2 && arg1.itemHeight,
    },
    arg2 ? arg2 : arg1
  )
