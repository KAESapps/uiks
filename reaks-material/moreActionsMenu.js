const vPile = require("../reaks/vPile")
const menuIcon = require("./icons/navigation/moreVertical")
const iconButton = require("./iconButton")
const flatButton = require("./flatButton")
const dialog = require("./dialog")

module.exports = actions => rootCtx =>
  iconButton(
    { icon: menuIcon },
    dialog({
      content: vPile(
        actions.map(([text, action]) =>
          flatButton(text, ctx => () => {
            // TODO: attendre le retour d'un promise pour fermer le menu ?
            ctx.closePopup()
            action(rootCtx)()
          })
        )
      ),
      actions: [dialog.cancelButton()],
    })
  )(rootCtx)
