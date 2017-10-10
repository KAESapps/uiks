const create = require("lodash/create")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const hFlex = require("../reaks/hFlex").reaks
const size = require("../reaks/size").reaksWrapper
const border = require("../reaks/border").reaksWrapper
const { observable } = require("reactivedb/obs")
const withResponsiveSize = require("../reaks/withResponsiveSize")

module.exports = ({ panel, content, breakWidth }) =>
  withResponsiveSize(breakWidth, ctx => {
    const isOpenNarrow = observable(false)
    const isOpenLarge = observable(true)

    const newCtx = create(ctx, {
      togglePanel: () => {
        if (ctx.responsiveSize() === "narrow") {
          isOpenNarrow(!isOpenNarrow())
        } else {
          isOpenLarge(!isOpenLarge())
        }
      },
      // use this method after a click on menu item in panel for instance
      // handles auto-close on mobile
      panelDefaultAction: () => {
        if (ctx.responsiveSize() === "narrow") {
          isOpenNarrow(false)
        }
      },
    })

    return hFlex([
      [
        {
          weight: () =>
            (ctx.responsiveSize() === "narrow" ? isOpenNarrow() : isOpenLarge())
              ? null
              : 0,
        },
        panel(newCtx),
      ],
      content(newCtx),
    ])
  })
