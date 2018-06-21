const isArray = require("lodash/isArray")
const isString = require("lodash/isString")
const isPlainObject = require("lodash/isPlainObject")
const assign = require("lodash/assign")

const label = require("../reaks/label")
const border = require("../reaks/border")
const style = require("reaks/style")
const seq = require("reaks/seq")
const innerMargin = require("../reaks-layout/innerMargin")
const component = require("../reaks/ctx-level-helpers/component")
const table = require("../reaks/table")
const group = require("../reaks/group")

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

  const rowMixins = [border.mixin({ b: true })]
  if (!opts.noMargin) {
    rowMixins.push(() => innerMargin({ v: 10 }))
  }
  if (opts.rowMixin) {
    rowMixins.push(opts.rowMixin)
  }
  opts.rowMixin = group(rowMixins)

  return table(
    opts,
    args.map(columnArg => {
      if (isArray(columnArg)) {
        let opts = columnArg[0]
        if (isPlainObject(opts)) {
          opts = assign({}, opts, {
            header: opts.header && columnHeader(opts.header),
          })
        } else {
          opts = opts && columnHeader(opts)
        }
        return [opts, columnArg[1]]
      } else {
        return columnArg
      }
    })
  )
}
