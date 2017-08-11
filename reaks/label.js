const component = require("./ctx-level-helpers/component")
const text = require("reaks/text")
const style = require("reaks/style")
const seq = require("reaks/seq")

module.exports = component(arg =>
  seq([
    text(arg),
    style({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    }),
  ])
)
