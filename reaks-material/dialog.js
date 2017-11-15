const flatButton = require("./flatButton")
const button = require("./button")
const mix = require("../reaks/mix")
const margin = require("../reaks/margin")
const align = require("../reaks/align")
const innerMargin = require("../reaks/innerMargin")
const label = require("../reaks/label")
const text = require("../reaks/text")
const style = require("../reaks/style")
const vPile = require("../reaks/vPile")
const hPile = require("../reaks/hPile")
const colors = require("material-colors")
const withPopup = require("../reaks/withPopup")

// start retrocompat
const isFunction = require("lodash/isFunction")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")

const dialogArgs = ({ title, content, actions, modal }) => ctx => ({
  title: contextualize(title, ctx),
  content: contextualize(content, ctx),
  modal,
  actions: actions.map(action => contextualize(action, ctx)),
})

const dialogLegacy = arg => ctx => () => {
  const args = isFunction(arg) ? arg(ctx) : dialogArgs(arg)(ctx)
  return ctx.dialog(args)
}
// end retrocompat

const titleLabel = text =>
  mix(
    [
      margin.mixin({ h: 24, b: 20 }),
      style.mixin({
        fontSize: 22,
      }),
    ],
    label(text)
  )

const contentArea = content => margin({ h: 24, b: 24 }, content)

const bodyText = message =>
  style(
    {
      color: colors.grey[600],
    },
    text(message || "")
  )

const dialogPopupLayer = ({ title, content, actions = [] }) =>
  withPopup.popupBuilder(
    mix(
      [
        innerMargin.mixin({ t: 24 }),
        style.mixin({
          minWidth: "75%",
          maxWidth: 768,
          maxHeight: "100%",
          boxSizing: "border-box",
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow:
            "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
        }),
      ],
      vPile([
        titleLabel(title),
        [{ weight: 1 }, contentArea(content)],
        align({ h: "right" }, margin({ v: 8, l: 24, r: 8 }, hPile(actions))),
      ])
    )
  )

const dialog = arg => ctx => {
  // retrocompat
  if (ctx.dialog) {
    return dialogLegacy(arg)(ctx)
  }

  return () => {
    return ctx.popup(dialogPopupLayer(arg), ctx, arg)
  }
}

const alert = ({ title, message, dismissLabel = "OK", onClose }) => {
  const dismissAction = ctx => () => {
    ctx.closePopup()
    onClose && onClose()
  }
  return dialog({
    title,
    content: bodyText(message),
    actions: [flatButton(dismissLabel, dismissAction)],
    modal: true,
    nested: false,
  })
}

const confirm = ({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}) => {
  const closeAction = res => ctx => () => {
    const onClose = res ? onConfirm : onCancel
    onClose && onClose()
    ctx.closePopup()
  }
  return dialog({
    title,
    content: bodyText(message),
    actions: [
      flatButton({ label: cancelLabel, primary: false }, closeAction(false)),
      button(confirmLabel, closeAction(true)),
    ],
    modal: true,
    nested: false,
  })
}

dialog.dialogPopupLayer = dialog.popupLayer = dialogPopupLayer

dialog.alert = alert
dialog.confirm = confirm

// retrocompat
dialog.dialogArgs = dialog.args = dialogArgs

module.exports = dialog
