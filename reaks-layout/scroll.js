const seq = require("reaks/seq")
const style = require("reaks/style")

module.exports = () =>
  seq([
    style({
      overflow: "auto",
    }),
  ])
