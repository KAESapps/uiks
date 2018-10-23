const isPlainObject = require("lodash/isPlainObject")
const displayIf = require("../reaks/displayIf")
const vPile = require("../reaks/vPile")
const menuIcon = require("./icons/navigation/moreVertical")
const iconButton = require("./iconButton")
const flatButton = require("./flatButton")
const dialog = require("./dialog")

const optionalDisplayIf = (cond, view) => (cond ? displayIf(cond, view) : view)

module.exports = actions => rootCtx =>
  iconButton(
    { icon: menuIcon, color: ctx => ctx.colors.textOnPrimary },
    dialog({
      content: vPile(
        actions.map(([opts, action]) => {
          const { label, displayIf: cond } = isPlainObject(opts)
            ? opts
            : { label: opts }
          return optionalDisplayIf(
            cond,
            flatButton(label, ctx => () => {
              // TODO: attendre le retour d'un promise pour fermer le menu ?
              ctx.closePopup()
              action(rootCtx)()
            })
          )
        })
      ),
      actions: [dialog.cancelButton()],
    })
  )(rootCtx)
