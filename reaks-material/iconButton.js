const defaults = require("lodash/defaults")
const clickable = require("../reaks/clickable").reaksWrapper
const icon = require("./icon").reaks
const align = require("../reaks-layout/align")
const size = require("../reaks/size").reaksWrapper
const hoverable = require("../reaks/hoverable").reaksWrapper
const style = require("../reaks/style").reaksMixin
const ctxCmp = require("../reaks/ctx-level-helpers/component")

module.exports = ctxCmp(
  (arg, action) => {
    const {
      icon: iconDef,
      iconSize,
      color,
      backgroundColor,
      backgroundColorHover = "rgba(0,0,0,0.1)",
    } = arg
    let { size: btnSize } = arg
    btnSize = defaults({}, btnSize, { h: 40, w: 40 })
    return hoverable(
      {
        out: backgroundColor && style({ backgroundColor }),
        over: style({ backgroundColor: backgroundColorHover }),
      },
      clickable(
        action,
        size(
          btnSize,
          align(
            { v: "center", h: "center" },
            icon({ icon: iconDef, size: iconSize, color })
          )
        )
      )
    )
  },
  function (arg, action) {
    return [
      defaults({}, arg, {
        color: ctx => ctx.colors.iconDefault,
      }),
      action,
    ]
  }
)
