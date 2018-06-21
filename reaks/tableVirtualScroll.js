const isString = require("lodash/isString")
const assign = require("lodash/assign")
const defaults = require("lodash/defaults")
const label = require("./label")
const style = require("reaks/style")
const seq = require("reaks/seq")
const component = require("./ctx-level-helpers/component")
const table = require("./table")
const vFlex = require("./vFlex")
const vListVirtualScroll = require("./vListVirtualScroll")
const group = require("./group")
const border = require("./border")

const columnHeader = component(
  arg => seq([arg, style({ fontSize: 12 })]),
  arg => (isString(arg) ? [label(arg)] : [arg])
)

module.exports = function(arg1, arg2) {
  let opts, args
  if (arguments.length === 1) {
    args = arg1
    opts = {}
  } else {
    opts = arg1
    args = arg2
  }

  args = table.normalizeColumnArgs(args)

  const rowMixins = [border.mixin({ b: true })]
  if (opts.rowMixin) {
    rowMixins.push(opts.rowMixin)
  }
  opts.rowMixin = group(rowMixins)

  const { header, row } = table(
    opts,
    args.map((columnArg, c) => {
      let opts = columnArg[0]
      if (c === 0) {
        opts = defaults({}, opts, {
          margin: { l: 8 },
        })
      }
      if (c === args.length - 1) {
        opts = defaults({}, opts, {
          margin: { r: 8 },
        })
      }
      opts = assign({}, opts, { header: columnHeader(opts.header) })
      return [opts, columnArg[1]]
    })
  )

  const disableEnsureItemVisible = ctx =>
    ctx.ensureItemVisible ? () => ctx.ensureItemVisible(false) : null
  const getDefaultVisibleItem = ctx =>
    ctx.ensureItemVisible
      ? () => {
          return ctx.ensureItemVisible() ? ctx.activeItem() : null
        }
      : null

  return vFlex([
    ["fixed", header],
    vListVirtualScroll({
      itemHeight: opts.itemHeight || 43,
      item: row,
      getDefaultVisibleItem,
      disableEnsureItemVisible,
    }),
  ])
}
