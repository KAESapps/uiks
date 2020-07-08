const wrapper = require("./ctx-level-helpers/wrapper")
const style = require("reaks/style")

module.exports = wrapper(style, {
  mapArgs: (activeStyle) => {
    return [
      (ctx) => {
        if (!activeStyle) {
          activeStyle = {
            backgroundColor: ctx.colors.highlight || ctx.colors.primary,
            color: ctx.colors.textOnHighlight || ctx.colors.textOnPrimary,
          }
        }
        return () => ctx.activeItem() === ctx.value && activeStyle
      },
    ]
  },
  noReaksLevel: true,
})
