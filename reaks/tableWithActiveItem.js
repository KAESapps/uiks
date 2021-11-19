const child = require("reaks/child")
const group = require("./group")
const style = require("./style")
const table = require("./tableVirtualScroll")
const clickable = require("./clickable")
const activeItem = require("../core/activeItem")
const displayIf = require("uiks/reaks/displayIf")

// si pas de next, on utilise la nouvelle convention "openItem", sinon la convention "setActiveItem/ensureItemVisible/next"
const rowMixin = (opts = {}) => {
  const clickableMixin = clickable.mixin(
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

  return group([
    displayIf(
      ctx => () => ctx.activeItem() === ctx.value,
      ctx =>
        child(
          style.reaksMixin({
            position: "absolute",
            width: "100%",
            height: "calc(100% - 2px)",
            pointerEvents: "none",
            backgroundColor: "rgba(14,120,235,0.1)",
            mixBlendMode: "multiply",
            borderBottom: "1px solid rgb(14 120 235)",
            borderTop: "1px solid rgb(14 120 235)",
          })
        )
    ),
    clickableMixin,
  ])
}

const tableGenerator = (arg1, arg2) => {
  const opts = arg2 ? arg1 : {}
  const columns = arg2 ? arg2 : arg1

  return table(
    {
      rowMixin: rowMixin(opts),
      itemHeight: opts.itemHeight,
      withHorizontalScroll: opts.withHorizontalScroll,
    },
    columns
  )
}
tableGenerator.rowMixin = rowMixin

module.exports = tableGenerator
