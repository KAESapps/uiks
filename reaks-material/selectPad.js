const isFunction = require("lodash/isFunction")
const toString = require("lodash/toString")
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

//recherche si l'item (cle de type texte du enum) est sélectionné, la sélection pouvant être un string, un number (cas d'une prop de type integer que l'on transfrome à la volée en type enum) ou un array de string ou de integer
const isItemSelected = (item, selection) => {
  if (Array.isArray(selection)) {
    return includes(selection, item) || includes(selection.map(toString), item)
  }
  return item === selection || item === toString(selection)
}

const {
  parent: asFlexParent,
  child: flexChildStyle,
} = require("../reaks-layout/flex/style")
const vPileCfg = require("../reaks-layout/flex/configs/vPile")
const hPileCfg = require("../reaks-layout/flex/configs/hPile")
const hFlexCfg = require("../reaks-layout/flex/configs/hFlex")
const vFlexCfg = require("../reaks-layout/flex/configs/vFlex")

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
const vFlex = (arg1, arg2) =>
  mix(
    [() => asFlexParent(vFlexCfg)],
    repeat(arg1, mix([() => flexChildStyle(vFlexCfg)], arg2))
  )
const hFlex = (arg1, arg2) =>
  mix(
    [() => asFlexParent(hFlexCfg)],
    repeat(arg1, mix([() => flexChildStyle(hFlexCfg)], arg2))
  )

module.exports = arg => {
  const {
    items,
    itemLabel = valueLoadingAs("", propQuery("label")),
    itemEnabled,
    itemHeight = 36,
    multiple = false,
    horizontal = false,
    flex,
  } = isFunction(arg) ? { items: arg } : arg

  const padKey = mix(
    [
      size.mixin({ h: itemHeight }),
      innerMargin.mixin({ h: 8 }),
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
          style.mixin(
            ctx => () =>
              isItemSelected(ctx.value, ctx.selectedValue())
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
        falsy: style.mixin(
          ctx => () =>
            isItemSelected(ctx.value, ctx.selectedValue())
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
    align({ h: "center", v: "center" }, label({ noEllipsis: true }, itemLabel))
  )

  return assignCtx(
    { selectedValue: ctx => ctx.value, items },
    (horizontal ? (flex ? hFlex : hList) : flex ? vFlex : vList)(
      ctx => ctx.items,
      padKey
    )
  )
}
