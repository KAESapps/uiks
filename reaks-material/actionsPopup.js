const isPlainObject = require("lodash/isPlainObject")
const displayIf = require("../reaks/displayIf")
const normalizeActionsArg = require("../core/actions/normalizeArg")
const vPile = require("../reaks/vPile")
const button = require("./button")
const dialog = require("./dialog")

const optionalDisplayIf = (cond, view) => (cond ? displayIf(cond, view) : view)

module.exports = actions => rootCtx =>
  dialog({
    content: vPile(
      { gap: 12 },
      normalizeActionsArg(actions).map(
        ([{ label, displayIf: cond }, action]) => {
          action = action && action(rootCtx)

          return optionalDisplayIf(
            cond,
            button(label, ctx => () => {
              // TODO: attendre le retour d'un promise pour fermer le menu ?
              ctx.closePopup()
              action()
            })
          )
        }
      )
    ),
    actions: [dialog.cancelButton()],
  })(rootCtx)
