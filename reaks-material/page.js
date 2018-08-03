const isArray = require("lodash/isArray")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")
const actionLayout = require("./pageActionLayout")
const moreActionsMenu = require("./moreActionsMenu")

module.exports = function(args) {
  const actions = isArray(args.action)
    ? args.action
    : args.action
      ? [args.action]
      : []
  if (args.moreActions) {
    actions.push(moreActionsMenu(args.moreActions))
  }

  return ctx => {
    return {
      title: contextualize(args.title, ctx),
      content: args.content(ctx),
      action: actions.length > 0 && actionLayout(actions)(ctx),
      canExit: args.canExit && args.canExit(ctx),
    }
  }
}
