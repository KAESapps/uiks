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
const hFlex = require("../reaks-layout/hFlex")
const icon = require("./icon").reaks
const hoverable = require("../reaks/hoverable").reaksMixin
const color = require("color")

module.exports = ctxComponent(
  (arg, action, opts) => {
    const { text, icon: iconDef } = isString(arg) ? { text: arg } : arg
    let { textColor, backgroundColor, height, flat } = defaults({}, opts, {
      textColor: colors.black,
      backgroundColor: colors.grey[300],
      height: 40,
      flat: false,
    })

    if (flat) backgroundColor = null

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
        ? hFlex({ gap: 6, align: "center" }, [["fixed", iconCmp], textCmp])
        : iconCmp || textCmp

    return seq([
      // action call, disabled when already running
      swap(
        () =>
          state() !== "running" &&
          clickable(() => {
            const actionRes = action()
            if (actionRes && actionRes.then) {
              state("running")
              timeoutId && clearTimeout(timeoutId)
              actionRes
                .then(() => state("success"))
                .catch(() => state("error"))
                .then(() => {
                  timeoutId = setTimeout(() => {
                    state("idle")
                    timeoutId = null
                  }, 2000)
                })
            }
          })
      ),
      // text, spinner & icons, conditionally displayed
      zPile([
        [{ sizer: true }, visibleIf("idle", content)],
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
          !flat &&
          "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
        paddingLeft: iconDef ? 8 : 16,
        paddingRight: text ? 16 : 8,
        fontSize: 14,
        fontWeight: 500,
      }),
      hoverable({
        out: style({ backgroundColor }),
        over: style({
          backgroundColor: backgroundColor
            ? color(backgroundColor).darken(0.1).string()
            : "rgba(0, 0, 0, 0.1)",
        }),
      }),
    ])
  },
  function (text, action, opts) {
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
