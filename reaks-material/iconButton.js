const clickable = require("../reaks/clickable").reaksWrapper
const icon = require("./icon").reaks
const align = require("../reaks-layout/align")
const size = require("../reaks/size").reaksWrapper
const hoverable = require("../reaks/hoverable").reaksWrapper
const style = require("../reaks/style").reaksMixin
const ctxCmp = require("../reaks/ctx-level-helpers/component")

module.exports = ctxCmp((iconArg, action) =>
  hoverable(
    {
      over: style({ backgroundColor: "rgba(0,0,0,0.1)" }),
    },
    clickable(
      action,
      size({ h: 40, w: 40 }, align({ v: "center", h: "center" }, icon(iconArg)))
    )
  )
)
