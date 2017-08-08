const create = require("lodash/create")
const renderFullscreen = require("reaks-layout/renderFullscreen")
const swap = require("reaks/swap")
const child = require("reaks/child")
const seq = require("reaks/seq")
const style = require("reaks/style")
const text = require("reaks/text")
const label = require("../reaks/reaks-level/label")
const align = require("reaks-layout/align")
const margin = require("reaks-layout/margin")
const innerMargin = require("reaks-layout/innerMargin")
const vPile = require("reaks-layout/vPile")
const hPile = require("reaks-layout/hPile")
const observable = require("ks-data/observable")
const materialRoot = require("./root")
const flatButton = require("./flatButton").reaks
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

module.exports = view => ctx => {
  const dialogContent = observable()

  const closeDialog = () => dialogContent(null)

  return seq([
    renderFullscreen(
      seq([
        materialRoot({ fontPath: "assets/" }),
        align({ v: "center", h: "center" }),
        style(() => ({
          display: dialogContent() ? "flex" : "none",
        })),
        style({
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }),
        child(
          seq([
            innerMargin({ t: 24 }),
            style({
              minWidth: "75%",
              maxWidth: 768,
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow:
                "rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px",
            }),
            swap(dialogContent),
          ])
        ),
      ])
    ),
    view(
      create(ctx, {
        alert: ({ title, message, dismissLabel = "OK" }) =>
          new Promise(resolve => {
            const dismissAction = () => {
              closeDialog()
              resolve()
            }
            dialogContent(
              vPile([
                titleLabel(title),
                bodyText(message),
                seq([
                  align({ h: "right" }),
                  margin({ v: 8, l: 24, r: 8 }),
                  child(flatButton(dismissLabel, dismissAction)),
                ]),
              ])
            )
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
            dialogContent(
              vPile([
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
              ])
            )
          }),
        dialog: ({ title, content, actions = [] }) => {
          dialogContent(
            vPile([
              titleLabel(title),
              contentArea(content),
              seq([
                align({ h: "right" }),
                margin({ v: 8, l: 24, r: 8 }),
                hPile(actions),
              ]),
            ])
          )
        },
        closeDialog,
      })
    ),
  ])
}
