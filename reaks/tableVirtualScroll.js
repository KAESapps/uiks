const table = require("./table")
const vFlex = require("./vFlex")
const vListVirtualScroll = require("./vListVirtualScroll")
const group = require("./group")
const border = require("./border")
const tableColumnDefaultOpts = require("./tableColumnDefaultOpts")

module.exports = function (arg1, arg2) {
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
      return [tableColumnDefaultOpts(opts, c, args), columnArg[1]]
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

  const body = vListVirtualScroll({
    itemHeight: opts.itemHeight || 43,
    item: row,
    getDefaultVisibleItem,
    disableEnsureItemVisible,
  })

  const fullTable = vFlex([["fixed", header], body])

  fullTable.header = header
  fullTable.body = body
  fullTable.row = row

  return fullTable
}
