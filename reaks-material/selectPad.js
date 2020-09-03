const isFunction = require("lodash/isFunction")
const includes = require("lodash/includes")
const intersection = require("lodash/intersection")
const without = require("lodash/without")
const concat = require("lodash/concat")
const assignCtx = require("uiks/core/assign")
const group = require("uiks/reaks/group")
const mix = require("uiks/reaks/mix")
const style = require("uiks/reaks/style")
const repeat = require("uiks/reaks/repeat")
const switchBoolean = require("uiks/reaks/switchBoolean")
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
const hPileCfg = require("../reaks-layout/flex/configs/hPile")
const vList = (arg1, arg2) =>
  mix(
    [() => asFlexParent(vPileCfg)],
    repeat(arg1, mix([() => flexChildStyle(vPileCfg)], arg2))
  )
const hList = (arg1, arg2) =>
  mix(
    [() => asFlexParent(hPileCfg)],
    repeat(arg1, mix([() => flexChildStyle(hPileCfg)], arg2))
  )

module.exports = arg => {
  const {
    items,
    itemLabel = valueLoadingAs("", propQuery("label")),
    itemEnabled,
    multiple = false,
    horizontal = false,
  } = isFunction(arg) ? { items: arg } : arg

  const padKey = mix(
    [
      size.mixin({ h: 36 }),
      innerMargin.mixin({ h: 8 }),
      style.mixin({
        fontWeight: 500,
        fontSize: 16,
      }),
      switchBoolean(itemEnabled || true, {
        truthy: group([
          ctx =>
            onTouchStart(
              multiple
                ? () => {
                    let selectedValues = ctx.selectedValue() || []
                    if (includes(selectedValues, ctx.value)) {
                      selectedValues = without(selectedValues, ctx.value)
                    } else {
                      selectedValues = concat(selectedValues, [ctx.value])
                    }
                    // intersection with items so that no old items stays in selected array
                    ctx.setValue(intersection(ctx.items(), selectedValues))
                  }
                : () => {
                    if (ctx.selectedValue() !== ctx.value) {
                      ctx.setValue(ctx.value)
                    } else {
                      ctx.setValue(null)
                    }
                  }
            ),
          style.mixin(ctx => () =>
            (
              multiple
                ? includes(ctx.selectedValue(), ctx.value)
                : ctx.selectedValue() === ctx.value
            )
              ? {
                  backgroundColor: ctx.colors.primary,
                  color: ctx.colors.textOnPrimary,
                }
              : {
                  backgroundColor: colors.grey[100],
                  color: colors.grey[800],
                }
          ),
        ]),
        falsy: style.mixin(ctx => () =>
          (
            multiple
              ? includes(ctx.selectedValue(), ctx.value)
              : ctx.selectedValue() === ctx.value
          )
            ? {
                backgroundColor: ctx.colors.lightPrimary,
                color: ctx.colors.textOnPrimary,
              }
            : {
                color: colors.grey[400],
              }
        ),
      }),
    ],
    align({ h: "center", v: "center" }, label({ ellipsis: false }, itemLabel))
  )

  return assignCtx(
    { selectedValue: ctx => ctx.value, items },
    (horizontal ? hList : vList)(ctx => ctx.items, padKey)
  )
}
