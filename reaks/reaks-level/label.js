const text = require("reaks/text")
const style = require("reaks/style")
const seq = require("reaks/seq")

module.exports = arg =>
  seq([
    text(arg),
    style({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    }),
  ])
