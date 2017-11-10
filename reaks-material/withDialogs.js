const create = require("lodash/create")
const swap = require("reaks/swap")
const child = require("reaks/child")
const seq = require("reaks/seq")
const style = require("reaks/style")
const text = require("reaks/text")
const label = require("../reaks/label").reaks
const align = require("../reaks-layout/align")
const margin = require("../reaks-layout/margin")
const innerMargin = require("../reaks-layout/innerMargin")
const vPile = require("../reaks-layout/vPile")
const hPile = require("../reaks-layout/hPile")
const zPile = require("../reaks-layout/zPile")
const { observable } = require("kobs")
const flatButton = require("./flatButton").reaks
const clickable = require("../reaks/clickable").reaksMixin
const colors = require("material-colors")

const titleLabel = text =>
  seq([
    label(text),
    margin({ h: 24, b: 20 }),
    style({
      fontSize: 22,
    }),
  ])

const contentArea = content => seq([margin({ h: 24, b: 24 }), content])
const bodyText = message =>
  contentArea(
    seq([
      text(message || ""),
      style({
        color: colors.grey[600],
      }),
    ])
  )

const disableState = { enabled: false }

module.exports = view => ctx => {
  const dialogParams = observable(disableState)
  const dialogContent = () => dialogParams().content
  const isEnabled = () => dialogParams().enabled
  const isModal = () => dialogParams().modal

  const closeDialog = () => dialogParams(disableState)

  return zPile({ setPositionRelative: false }, [
    view(
      create(ctx, {
        alert: ({ title, message, dismissLabel = "OK" }) =>
          new Promise(resolve => {
            const dismissAction = () => {
              closeDialog()
              resolve()
            }
            dialogParams({
              content: vPile([
                titleLabel(title),
                bodyText(message),
                seq([
                  align({ h: "right" }),
                  margin({ v: 8, l: 24, r: 8 }),
                  child(flatButton(dismissLabel, dismissAction)),
                ]),
              ]),
              enabled: true,
              modal: true,
            })
          }),
        confirm: ({
          title,
          message,
          confirmLabel = "OK",
          cancelLabel = "Annuler",
        }) =>
          new Promise(resolve => {
            const closeAction = result => () => {
              closeDialog()
              resolve(result)
            }
            dialogParams({
              content: vPile([
                titleLabel(title),
                bodyText(message),
                seq([
                  align({ h: "right" }),
                  margin({ v: 8, l: 24, r: 8 }),
                  hPile([
                    flatButton(
                      { label: cancelLabel, primary: false },
                      closeAction(false)
                    ),
                    flatButton(confirmLabel, closeAction(true)),
                  ]),
                ]),
              ]),
              modal: true,
              enabled: true,
            })
          }),
        dialog: ({ title, content, actions = [], modal = false }) => {
          dialogParams({
            content: vPile([
              titleLabel(title),
              [{ weight: 1 }, contentArea(content)],
              seq([
                align({ h: "right" }),
                margin({ v: 8, l: 24, r: 8 }),
                hPile(actions),
              ]),
            ]),
            modal,
            enabled: true,
          })
        },
        closeDialog,
      })
    ),
    seq([
      style(() => ({
        display: isEnabled() ? "flex" : "none",
      })),
      zPile({ setPositionRelative: false }, [
        seq([
          style({
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }),
          swap(() => !isModal() && clickable(closeDialog)),
        ]),
        seq([
          style({
            pointerEvents: "none",
          }),
          align({ v: "center", h: "center" }),
          child(
            seq([
              innerMargin({ t: 24 }),
              style({
                pointerEvents: "all",
                minWidth: "75%",
                maxWidth: 768,
                maxHeight: "100%",
                boxSizing: "border-box",
                backgroundColor: "white",
                borderRadius: 3,
                boxShadow:
                  "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
              }),
              swap(dialogContent),
            ])
          ),
        ]),
      ]),
    ]),
  ])
}
