const seq = require("reaks/seq")
const size = require("reaks/size")
const wrapper = require("../reaks/ctx-level-helpers/wrapper")
const border = require("uiks/reaks-layout/border")
const align = require("uiks/reaks-layout/align")
const innerMargin = require("uiks/reaks-layout/innerMargin")

// make a label look like a text input
module.exports = wrapper(() =>
  seq([
    size({ hMin: 32 }),
    innerMargin({ h: 3 }),
    align({ v: "center" }),
    border({ b: { color: "#AAA" } }),
  ])
)
