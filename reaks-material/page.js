const isArray = require("lodash/isArray")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")
const actionLayout = require("./pageActionLayout")

module.exports = function(args) {
  const action = isArray(args.action) ? actionLayout(args.action) : args.action
  return ctx => {
    return {
      title: contextualize(args.title, ctx),
      content: args.content(ctx),
      action: action && action(ctx),
      canExit: args.canExit && args.canExit(ctx),
    }
  }
}
