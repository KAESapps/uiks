const table = require("./tableWithMargins")
const value = require("../core/value")
const clickable = require("../reaks/clickable")
const border = require("../reaks/border")
const label = require("../reaks/label")
const group = require("../reaks/group")
const hoverable = require("../reaks/hoverable")
const style = require("../reaks/style")
const assignCtx = require("../core/assign")

module.exports = args => {
  const cmp = value(
    args.value,
    border(
      { all: true, b: false },
      table(
        {
          rowMixin: group([
            hoverable.mixin({
              over: style.mixin({ backgroundColor: "rgba(0,0,0,0.1)" }),
            }),
            clickable.mixin(ctx => () => ctx.setValue(ctx.value)),
          ]),
        },
        [[{ margin: { h: 8 } }, label(args.itemLabel)]]
      ).body
    )
  )
  return args.onSelect ? assignCtx({ setValue: args.onSelect }, cmp) : cmp
}
