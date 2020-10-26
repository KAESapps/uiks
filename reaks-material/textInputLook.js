const seq = require("reaks/seq")
const size = require("reaks/size")
const wrapper = require("../reaks/ctx-level-helpers/wrapper")
const border = require("uiks/reaks-layout/border")
const align = require("uiks/reaks-layout/align")
const innerMargin = require("uiks/reaks-layout/innerMargin")
const style = require("reaks/style")

// make a label look like a text input
module.exports = wrapper(
  ({
    border: withBorder = true,
    borderColor = "#AAA",
    backgroundColor,
    hAlign = "left",
  } = {}) =>
    seq([
      size({ hMin: 32 }),
      innerMargin({ h: 6 }),
      align({ v: "center", h: hAlign }),
      withBorder && border({ color: borderColor, radius: 3 }),
      style({ backgroundColor }),
    ])
)
