const isFunction = require("lodash/isFunction")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")

const dialogArgs = ({ title, content, actions, modal }) => ctx => ({
  title: contextualize(title, ctx),
  content: contextualize(content, ctx),
  modal,
  actions: actions.map(action => contextualize(action, ctx)),
})

const dialog = arg => ctx => () => {
  const args = isFunction(arg) ? arg(ctx) : dialogArgs(arg)(ctx)
  return ctx.dialog(args)
}

dialog.dialogArgs = dialogArgs

module.exports = dialog