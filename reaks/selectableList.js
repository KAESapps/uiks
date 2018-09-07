const value = require("../core/value")
const clickable = require("../reaks/clickable")
const border = require("../reaks/border")
const label = require("../reaks/label")
const align = require("../reaks/align")
const hoverable = require("../reaks/hoverable")
const style = require("../reaks/style")
const innerMargin = require("../reaks/innerMargin")
const assignCtx = require("../core/assign")
const vListVirtualScroll = require("uiks/reaks/vListVirtualScroll")

module.exports = args => {
  const cmp = value(
    args.value,
    border(
      vListVirtualScroll({
        itemHeight: 42,
        item: border(
          { b: true },
          hoverable(
            {
              over: style.mixin({ backgroundColor: "rgba(0,0,0,0.1)" }),
            },
            clickable(
              ctx => () => ctx.setValue(ctx.value),
              align(
                { v: "center" },
                innerMargin({ h: 8 }, label(args.itemLabel))
              )
            )
          )
        ),
      })
    )
  )
  return args.onSelect ? assignCtx({ setValue: args.onSelect }, cmp) : cmp
}
