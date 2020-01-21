const concat = require("lodash/concat")
const isArray = require("lodash/isArray")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")
const actionLayout = require("./pageActionLayout")
const moreActionsMenu = require("./moreActionsMenu")

module.exports = function (args) {
  // let actions = isArray(args.action)
  //   ? args.action
  //   : args.action
  //     ? [args.action]
  //     : []
  // if (args.moreActions && args.moreActions.length) {
  //   actions = concat(actions, moreActionsMenu(args.moreActions))
  // }
  const actions = concat(args.action, (args.moreActions && args.moreActions.length) ? moreActionsMenu(args.moreActions) : [])

  return ctx => {
    return {
      title: contextualize(args.title, ctx),
      content: args.content(ctx),
      action: actions.length > 0 && actionLayout(actions)(ctx),
      canExit: args.canExit && args.canExit(ctx),
    }
  }
}
