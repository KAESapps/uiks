const seq = require("reaks/seq")
const style = require("reaks/style")
const repeat = require("reaks/repeat")
const innerMargin = require("../reaks-layout/innerMargin")
const onTouchStart = require("../reaks/onTouchStart")
const label = require("../reaks/label").reaks
const align = require("../reaks/align").reaks
const size = require("reaks/size")
const colors = require("material-colors")

module.exports = createItemKeysGetter => {
  return ctx => {
    const { setValue } = ctx

    const getItemKeys = createItemKeysGetter(ctx)
    const getItemLabel = k => () => {
      const res = ctx.query([{ constant: k }, { valueOfProp: "label" }])
      return res.loaded ? res.value : ""
    }

    const padKey = k => {
      return seq([
        align(
          { h: "left", v: "center" },
          label({ ellipsis: false }, getItemLabel(k))
        ),
        onTouchStart(() => {
          if (ctx.value() !== k) {
            setValue(k)
          } else {
            setValue(null)
          }
        }),
        innerMargin({ h: 8 }),
        size({ h: 36 }),
        style({
          fontWeight: 500,
          fontSize: 16,
        }),
        style(
          () =>
            ctx.value() === k
              ? {
                  backgroundColor: colors.teal[500],
                  color: colors.white,
                }
              : {
                  backgroundColor: colors.grey[100],
                  color: colors.grey[800],
                }
        ),
      ])
    }

    return seq([
      style({
        flexDirection: "column",
      }),
      repeat(getItemKeys, padKey),
    ])
  }
}
