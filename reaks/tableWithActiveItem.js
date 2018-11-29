const table = require("./tableVirtualScroll")
const clickable = require("./clickable")
const activeStyle = require("./activeStyle")
const activeItem = require("../core/activeItem")

module.exports = (arg1, arg2) =>
  table(
    {
      rowMixin: activeStyle(
        clickable.mixin(activeItem(ctx => () => ctx.value, arg2 && arg1.next))
      ),
      itemHeight: arg2 && arg1.itemHeight,
    },
    arg2 ? arg2 : arg1
  )
