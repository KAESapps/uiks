const hFlex = require("../reaks/hFlex")
const displayIf = require("../reaks/displayIf")
const value = require("../core/value")
const ctxAssign = require("../core/assign")
const withResponsiveSize = require("./withResponsiveSize")

module.exports = ({ master, detail, breakWidth }) => {
  return withResponsiveSize(
    breakWidth,
    hFlex([
      [
        {
          weight: ctx => () =>
            ctx.activeItem()
              ? ctx.responsiveSize() === "narrow" ? 0 : null
              : 1,
        },
        ctxAssign({ open: ctx => itemId => ctx.activeItem(itemId) }, master),
      ],
      [
        { weight: ctx => () => (ctx.activeItem() ? 1 : 0) },
        displayIf(
          ctx => ctx.activeItem,
          value(
            ctx => ctx.activeItem,
            ctxAssign({ close: ctx => () => ctx.activeItem(null) }, detail)
          )
        ),
      ],
    ])
  )
}
