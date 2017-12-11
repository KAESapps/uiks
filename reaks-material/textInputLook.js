const seq = require("reaks/seq")
const wrapper = require("../reaks/ctx-level-helpers/wrapper")
const border = require("uiks/reaks-layout/border")
const innerMargin = require("uiks/reaks-layout/innerMargin")

// make a label look like a text input
module.exports = wrapper(() =>
  seq([border({ b: { color: "#AAA" } }), innerMargin({ b: 6 })])
)
