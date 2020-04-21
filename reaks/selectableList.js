const value = require("../core/value")
const clickable = require("../reaks/clickable")
const border = require("./border")
const label = require("./label")
const align = require("./align")
const hoverable = require("./hoverable")
const style = require("./style")
const activeStyle = require("./activeStyle")
const innerMargin = require("./innerMargin")
const vListVirtualScroll = require("./vListVirtualScroll")
const assignCtx = require("../core/assign")

module.exports = args => {
  const cmp = value(
    args.value,
    border(
      vListVirtualScroll({
        itemHeight: 42,
        item: border(
          { b: true },
          activeStyle(
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
          )
        ),
      })
    )
  )
  return args.onSelect ? assignCtx({ setValue: args.onSelect }, cmp) : cmp
}
