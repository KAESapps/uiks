const isFunction = require("lodash/isFunction")
const includes = require("lodash/includes")
const without = require("lodash/without")
const concat = require("lodash/concat")
const assignCtx = require("uiks/core/assign")
const mix = require("uiks/reaks/mix")
const style = require("uiks/reaks/style")
const repeat = require("uiks/reaks/repeat")
const innerMargin = require("../reaks/innerMargin")
const onTouchStart = require("../reaks/onTouchStart")
const label = require("../reaks/label")
const align = require("../reaks/align")
const size = require("uiks/reaks/size")
const colors = require("material-colors")
const propQuery = require("../reactivedb/propQuery")
const valueLoadingAs = require("../reactivedb/valueLoadingAs")

const {
  parent: asFlexParent,
  child: flexChildStyle,
} = require("../reaks-layout/flex/style")
const vPileCfg = require("../reaks-layout/flex/configs/vPile")
const vList = (arg1, arg2) =>
  mix(
    [() => asFlexParent(vPileCfg)],
    repeat(arg1, mix([() => flexChildStyle(vPileCfg)], arg2))
  )

module.exports = arg => {
  const {
    items,
    itemLabel = valueLoadingAs("", propQuery("label")),
    multiple = false,
  } = isFunction(arg) ? { items: arg } : arg

  const padKey = mix(
    [
      ctx =>
        onTouchStart(
          multiple
            ? () => {
                const selectedValues = ctx.selectedValue() || []
                if (includes(selectedValues, ctx.value)) {
                  ctx.setValue(without(selectedValues, ctx.value))
                } else {
                  ctx.setValue(concat(selectedValues, [ctx.value]))
                }
              }
            : () => {
                if (ctx.selectedValue() !== ctx.value) {
                  ctx.setValue(ctx.value)
                } else {
                  ctx.setValue(null)
                }
              }
        ),
    ],
    mix(
      [
        size.mixin({ h: 36 }),
        innerMargin.mixin({ h: 8 }),
        style.mixin({
          fontWeight: 500,
          fontSize: 16,
        }),
        style.mixin(ctx => () =>
          (multiple
          ? includes(ctx.selectedValue(), ctx.value)
          : ctx.selectedValue() === ctx.value)
            ? {
                backgroundColor: colors.teal[500],
                color: colors.white,
              }
            : {
                backgroundColor: colors.grey[100],
                color: colors.grey[800],
              }
        ),
      ],
      align({ h: "left", v: "center" }, label({ ellipsis: false }, itemLabel))
    )
  )

  return assignCtx({ selectedValue: ctx => ctx.value }, vList(items, padKey))
}
