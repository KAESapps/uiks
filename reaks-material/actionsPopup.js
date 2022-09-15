const isArray = require("lodash/isArray")
const displayIf = require("../reaks/displayIf")
const normalizeActionsArg = require("../core/actions/normalizeArg")
const vPile = require("../reaks/vPile")
const button = require("./button")
const dialog = require("./dialog")
const style = require("../reaks/style")
const multilineText = require("../reaks/multilineText")
const innerMargin = require("../reaks/innerMargin")

const optionalDisplayIf = (cond, view) => (cond ? displayIf(cond, view) : view)

module.exports = arg => {
  const { title, actions } = isArray(arg) ? { actions: arg } : arg
  return rootCtx => {
    return dialog({
      title,
      maxWidth: 500,
      content: vPile(
        { gap: 18 },
        normalizeActionsArg(actions).map(
          ([{ label: labelArg, desc, displayIf: cond }, action]) => {
            action = action && action(rootCtx)
            const btn = button(labelArg, ctx => () => {
              // TODO: attendre le retour d'un promise pour fermer le menu ?
              ctx.closePopup()
              action()
            })
            return optionalDisplayIf(
              cond,
              desc
                ? vPile([
                    btn,
                    innerMargin(
                      { h: 4 },
                      style(
                        { fontSize: 12, fontStyle: "italic" },
                        multilineText(desc)
                      )
                    ),
                  ])
                : btn
            )
          }
        )
      ),
    })(rootCtx)
  }
}
