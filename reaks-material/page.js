const concat = require("lodash/concat")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")
const actionLayout = require("./pageActionLayout")
const moreActionsMenu = require("./moreActionsMenu")

module.exports = function (args) {
  const actions = concat(
    args.action,
    args.moreActions ? moreActionsMenu(args.moreActions) : []
  )

  return ctx => {
    const createContent = args.content(ctx)
    return {
      title: contextualize(args.title, ctx),
      content: domNode => {
        ctx._pageContentDomNode = domNode
        return createContent(domNode)
      },
      action: actions.length > 0 && actionLayout(actions)(ctx),
      canExit: args.canExit && args.canExit(ctx),

      minWidthAsChildPanel: args.minWidthAsChildPanel,
      minWidthAsParentPanel: args.minWidthAsParentPanel,
    }
  }
}
