const table = require("./tableVirtualScroll")
const clickable = require("./clickable")
const activeStyle = require("./activeStyle")
const activeItem = require("../core/activeItem")

module.exports = (arg1, arg2) => {
  const opts = arg2 ? arg1 : {}
  const columns = arg2 ? arg2 : arg1

  // si pas de next, on utilise la nouvelle convention "openItem", sinon la convention "setActiveItem/ensureItemVisible/next"
  return table(
    {
      rowMixin: activeStyle(
        clickable.mixin(
          opts.next
            ? activeItem(ctx => () => ctx.value, opts.next)
            : ctx =>
                ctx.openItem
                  ? () => ctx.openItem(ctx.value)
                  : () => {
                      ctx.setActiveItem(ctx.value)
                      ctx.ensureItemVisible && ctx.ensureItemVisible(true)
                    }
        )
      ),
      itemHeight: opts.itemHeight,
    },
    columns
  )
}
