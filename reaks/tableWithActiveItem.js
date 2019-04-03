const table = require("./tableVirtualScroll")
const clickable = require("./clickable")
const activeStyle = require("./activeStyle")
const activeItem = require("../core/activeItem")

// si pas de next, on utilise la nouvelle convention "openItem", sinon la convention "setActiveItem/ensureItemVisible/next"
const rowMixin = (opts = {}) =>
  activeStyle(
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
  )

const tableGenerator = (arg1, arg2) => {
  const opts = arg2 ? arg1 : {}
  const columns = arg2 ? arg2 : arg1

  return table(
    {
      rowMixin: rowMixin(opts),
      itemHeight: opts.itemHeight,
    },
    columns
  )
}
tableGenerator.rowMixin = rowMixin

module.exports = tableGenerator
