const isArray = require("lodash/isArray")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")
const hPile = require("../reaks/hPile")
const margin = require("../reaks/margin")

module.exports = function(args) {
  const action = isArray(args.action)
    ? hPile(
        { align: "center" },
        args.action.map(actionItem => margin({ l: 16 }, actionItem))
      )
    : args.action
  return ctx => {
    return {
      title: contextualize(args.title, ctx),
      content: args.content(ctx),
      action: action && action(ctx),
      canExit: args.canExit && args.canExit(ctx),
    }
  }
}
