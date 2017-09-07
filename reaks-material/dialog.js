const contextualize = require("../reaks/ctx-level-helpers/contextualize")

module.exports = ({ title, content, actions, modal }) => ctx => () =>
  ctx.dialog({
    title: contextualize(title, ctx),
    content: contextualize(content, ctx),
    modal,
    actions: actions.map(action => contextualize(action, ctx)),
  })
