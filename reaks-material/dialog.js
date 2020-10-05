const flatButton = require("./flatButton")
const button = require("./button")
const mix = require("../reaks/mix")
const margin = require("../reaks/margin")
const align = require("../reaks/align")
const innerMargin = require("../reaks/innerMargin")
const label = require("../reaks/label")
const multilineText = require("../reaks/multilineText")
const style = require("../reaks/style")
const vPile = require("../reaks/vPile")
const hPile = require("../reaks/hPile")
const colors = require("material-colors")
const withPopup = require("../reaks/withPopup")

// start retrocompat
const contextualize = require("../reaks/ctx-level-helpers/contextualize")

const dialogArgs = ({ title, content, actions, modal }) => ctx => ({
  title: contextualize(title, ctx),
  content: contextualize(content, ctx),
  modal,
  actions: actions.map(action => contextualize(action, ctx)),
})
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
    multilineText(message || "")
  )

const dialogPopupLayer = ({ title, content, actions = [], maxWidth = 768 }) =>
  withPopup.popupBuilder(
    mix(
      [
        innerMargin.mixin({ t: 24 }),
        style.mixin({
          width: "100%",
          maxWidth,
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
        align(
          { h: "right" },
          margin({ v: 8, l: 24, r: 8 }, hPile({ gap: 12 }, actions))
        ),
      ])
    )
  )

const dialog = arg => ctx => {
  const popup = arg.selfPopup || arg.replace ? ctx.selfPopup : ctx.popup
  return () => {
    return popup(dialogPopupLayer(arg), ctx, arg)
  }
}

const alert = ({
  title,
  message,
  dismissLabel = "OK",
  onClose: onCloseCtx,
}) => {
  const dismissAction = ctx => {
    const onClose = onCloseCtx && onCloseCtx(ctx)
    return () => {
      ctx.closePopup()
      onClose && onClose()
    }
  }
  return dialog({
    title,
    content: bodyText(message),
    actions: [button(dismissLabel, dismissAction)],
    modal: true,
    nested: false,
  })
}

const cancelButton = (cancelLabel = "Annuler", cb) =>
  flatButton({ label: cancelLabel, primary: false }, ctx => () => {
    cb && cb(ctx)()
    ctx.closePopup()
  })

const confirm = ({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuler",
  onClose: onCloseCtx,
  onConfirm: onConfirmCtx,
  onCancel: onCancelCtx,
}) => {
  const closeAction = res => rootCtx => ctx => {
    // les cb ne prennent pas le contexte de la popup de confirmation ce qui leur permet de s'éxécuter comme si il n'y avait pas eu de demande de confirmation préalable
    const onClose = onCloseCtx && onCloseCtx(rootCtx)
    const onResponse = res
      ? onConfirmCtx && onConfirmCtx(rootCtx)
      : onCancelCtx && onCancelCtx(rootCtx)

    return () => {
      ctx.closePopup() // on ferme le dialogue de confirmation avant d'éxécuter les cb (ce qui leur permet de rouvrir une popup si ils veulent sans conflit)
      onClose && onClose(res)
      onResponse && onResponse()
    }
  }
  return rootCtx =>
    dialog({
      title,
      content: bodyText(message),
      actions: [
        flatButton(
          { label: cancelLabel, primary: false },
          closeAction(false)(rootCtx)
        ),
        button(confirmLabel, closeAction(true)(rootCtx)),
      ],
      modal: true,
      nested: false,
    })(rootCtx)
}

dialog.dialogPopupLayer = dialog.popupLayer = dialogPopupLayer

dialog.alert = alert
dialog.confirm = confirm
dialog.cancelButton = cancelButton
// retrocompat
dialog.dialogArgs = dialog.args = dialogArgs

module.exports = dialog
