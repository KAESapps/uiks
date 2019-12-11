const defaults = require("lodash/defaults")
const isString = require("lodash/isString")
const label = require("../reaks/label").reaks
const ctxComponent = require("../reaks/ctx-level-helpers/component")
const seq = require("reaks/seq")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const align = require("../reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")
const spinner = require("./spinner").reaks
const zPile = require("../reaks-layout/zPile")
const { observable } = require("kobs")
const swap = require("reaks/swap")
const svgIcon = require("reaks/svgIcon")
const successIcon = require("./icons/action/done")
const errorIcon = require("./icons/alert/error")
const hPile = require("../reaks-layout/hPile")
const icon = require("./icon").reaks

module.exports = ctxComponent(
  (arg, action, opts) => {
    const { text, icon: iconDef } = isString(arg) ? { text: arg } : arg
    const { textColor, backgroundColor, height } = defaults({}, opts, {
      textColor: colors.black,
      backgroundColor: colors.grey[300],
      height: 40,
    })
    const state = observable("idle")
    const visibleIf = (visibleState, cmp) =>
      seq([
        cmp,
        style(() => ({
          visibility: state() === visibleState ? null : "hidden",
        })),
      ])

    let timeoutId

    const iconCmp = iconDef && icon({ icon: iconDef, color: textColor })
    const textCmp = text && label(text)
    const content =
      iconCmp && textCmp
        ? hPile({ gap: 6, align: "center" }, [iconCmp, textCmp])
        : iconCmp || textCmp

    return seq([
      // action call, disabled when already running
      swap(
        () =>
          state() !== "running" &&
          clickable(() => {
            timeoutId && clearTimeout(timeoutId)
            state("running")
            action()
              .then(() => state("success"))
              .catch(() => state("error"))
              .then(() => {
                timeoutId = setTimeout(() => {
                  state("idle")
                  timeoutId = null
                }, 2000)
              })
          })
      ),
      // text, spinner & icons, conditionally displayed
      zPile([
        [
          { sizer: true },
          visibleIf("idle", align({ h: "center", v: "center" }, content)),
        ],
        visibleIf(
          "running",
          align(
            { h: "center", v: "center" },
            spinner({ color: textColor, size: 28 })
          )
        ),
        visibleIf(
          "success",
          align(
            { h: "center", v: "center" },
            svgIcon(successIcon, { size: { h: 28, w: 28 }, color: textColor })
          )
        ),
        visibleIf(
          "error",
          align(
            { h: "center", v: "center" },
            svgIcon(errorIcon, { size: { h: 28, w: 28 }, color: "red" })
          )
        ),
      ]),
      // conditional background
      style(() => ({
        backgroundColor:
          state() === "success"
            ? "limegreen"
            : state() === "error"
            ? "#EEE"
            : backgroundColor,
      })),
      align({ h: "center", v: "center" }),
      size({ h: height }),
      style({
        color: textColor,
        textTransform: "uppercase",
        borderRadius: 2,
        boxShadow:
          "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
        paddingLeft: iconDef ? 8 : 16,
        paddingRight: text ? 16 : 8,
        fontSize: 14,
        fontWeight: 500,
      }),
    ])
  },
  function(text, action, opts) {
    return [
      text,
      action,
      defaults({}, opts, {
        textColor: ctx => ctx.colors.textOnSecondary,
        backgroundColor: ctx => ctx.colors.secondary,
      }),
    ]
  }
)
