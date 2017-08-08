const repeat = require("./repeat")
const group = require("./group")
const component = require("./ctx-level-helpers/component")
const style = require("reaks/style")

module.exports = item =>
  group([
    component(style)({
      flexDirection: "column",
    }),
    repeat(ctx => ctx.value, item),
  ])
