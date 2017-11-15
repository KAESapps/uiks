const renderFullscreen = require("../reaks/renderFullscreen")
const materialRoot = require("./root")
const withDialogs = require("./withDialogs")
const withPopup = require("../reaks/withPopup")
const button = require("./button")
const label = require("../reaks/label")
const vPile = require("../reaks/vPile")
const align = require("../reaks-layout/align")
const backgroundColor = require("../reaks/backgroundColor")
const dialog = require("./dialog")
const materialColors = require("material-colors")

const colors = {
  primary: materialColors.teal[500],
  darkPrimary: materialColors.teal[800],
  lightPrimary: materialColors.teal[100],
  textOnPrimary: "white",
  secondary: materialColors.pink[500],
  textOnSecondary: "white",
  fadedTextOnPrimary: materialColors.teal[50],
  darkText: "black",
  fadedDarkText: materialColors.grey[600],
  iconDefault: materialColors.grey[500],
}

const legacyDialog = vPile([
  button(
    "legacy dialog",
    dialog({
      title: "boîte de dialogue avec withDialogs",
      actions: [button("ok", ctx => ctx.closeDialog)],
      content: vPile([label("une popup")]),
    })
  ),
])

const customPopup = button("custom popup", ctx => () => {
  ctx.popup(
    withPopup.popupBuilder(
      backgroundColor(
        "white",
        vPile([
          label("reste pendant 2 seconde"),
          button("Close", ctx => ctx.closePopup),
        ])
      ),
      // custom alignment
      cmp => align({ v: "bottom" }, cmp)
    ),
    ctx
  )
  setTimeout(() => ctx.popup(false), 2000)
})

const simpleDialog = button(
  "simple dialog",
  dialog({
    title: "Test",
    content: label("test"),
    actions: [
      button("ok", ctx => () => {
        ctx.closePopup()
      }),
    ],
  })
)

const nestedDialogs = button(
  "nested dialogs",
  dialog({
    title: "Dialog 1",
    content: button(
      "dialog 2",
      dialog({
        title: "dialog 2",
        content: button(
          "dialog 3",
          dialog.confirm({
            title: "Etes-vous sûr ?",
            content: "Sûr de sûr ?",
          })
        ),
      })
    ),
    actions: [
      button("alert", dialog.alert({ title: "alert !", message: "!!" })),
    ],
  })
)

renderFullscreen(
  materialRoot(
    withDialogs(
      withPopup(vPile([legacyDialog, simpleDialog, customPopup, nestedDialogs]))
    )
  )
)({
  colors,
  getFileUrl: filename => "assets/" + filename,
})
