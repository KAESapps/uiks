const create = require("lodash/create")
const swap = require("reaks/swap")
const seq = require("reaks/seq")
const style = require("reaks/style")
const align = require("../reaks-layout/align")
const zPile = require("../reaks-layout/zPile")
const { observable } = require("kobs")
const clickable = require("./clickable").reaksMixin

const disableState = { enabled: false }

const popupBuilder = (
  content,
  aligner = cmp => align({ v: "center", h: "center" }, cmp)
) => ctx =>
  seq([
    style({
      pointerEvents: "none",
    }),
    aligner(
      seq([
        style({
          pointerEvents: "all",
        }),
        content(ctx),
      ])
    ),
  ])

const withPopup = function(opts, view) {
  if (arguments.length === 1) {
    view = opts
    opts = {}
  }
  const { ctxProp = "popup", setPositionRelative = false } = opts
  return ctx => {
    const popupParams = observable(disableState)

    const closePopup = () => popupParams(disableState)

    const popup = (popupLayer, ctx, opts = {}) => {
      if (popupLayer === false) {
        // close popup
        closePopup()
        return
      }
      if (!ctx) {
        throw new Error("popup(): ctx must be defined")
      }

      const { modal = false, nested = true } = opts

      popupParams({
        popupLayer,
        modal,
        enabled: true,
        ctx,
        nested,
      })
    }

    return seq([
      style({ pointerEvents: "none" }),
      zPile({ setPositionRelative }, [
        seq([
          style({ pointerEvents: "all" }),
          view(
            create(ctx, {
              [ctxProp]: popup,
            })
          ),
        ]),
        seq([
          style(() => ({
            display: popupParams().enabled ? "flex" : "none",
          })),
          zPile({ setPositionRelative: false }, [
            seq([
              style({
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                pointerEvents: "all",
              }),
              swap(() => !popupParams().modal && clickable(closePopup)),
            ]),
            swap(() => {
              const { enabled, popupLayer, ctx, nested } = popupParams()

              return (
                enabled &&
                (nested ? withPopup(popupLayer) : popupLayer)(
                  create(ctx, { selfPopup: popup, closePopup })
                )
              )
            }),
          ]),
        ]),
      ]),
    ])
  }
}

withPopup.popupBuilder = popupBuilder

module.exports = withPopup
