const isArray = require("lodash/isArray")
const isPlainObject = require("lodash/isPlainObject")
const isString = require("lodash/isString")
const isNumber = require("lodash/isNumber")
const assign = require("lodash/assign")
const hFlex = require("./hFlex")
const vFlex = require("./vFlex")
const scroll = require("./scroll")
const list = require("./list")
const align = require("./align")
const innerMargin = require("./innerMargin")
const border = require("./border")
const group = require("./group")
const label = require("./label")
const size = require("./size")

const normalizeColumnArgs = args => {
  return args.map((columnArg, c) => {
    let opts, cmp
    if (!isArray(columnArg)) {
      opts = null
      cmp = columnArg
    } else {
      opts = columnArg[0]
      cmp = columnArg[1]
    }

    if (!isPlainObject(opts)) {
      opts = { header: opts }
    }

    return [opts, cmp]
  })
}

const createCell = itemArg => {
  let [opts, cellContent] = itemArg
  let cell = cellContent
  if (!opts.noAlignWrapper) {
    cell = cell && align({ h: opts.hAlign, v: "center" }, cell)
  }
  if (opts.margin) {
    cell = innerMargin(opts.margin, cell)
  }
  if (isNumber(opts.width)) {
    cell = [{ weight: null }, size({ w: opts.width }, cell)]
  }
  return cell
}

const createColumnHeader = itemArg => {
  let opts = itemArg[0]
  let headerContent = opts.header
  if (isString(opts.header)) {
    headerContent = label(opts.header)
  }
  return createCell([
    assign({}, opts, { noAlignWrapper: false }),
    headerContent,
  ])
}

const table = function(arg1, arg2) {
  let opts, args
  if (arguments.length === 1) {
    args = arg1
    opts = {}
  } else {
    opts = arg1
    args = arg2
  }

  args = normalizeColumnArgs(args)

  let row = hFlex(args.map(createCell))
  if (opts.rowMixin) {
    row = group([row, opts.rowMixin])
  }

  const header = border({ b: true }, hFlex(args.map(createColumnHeader)))
  const body = scroll(list(row))
  const table = vFlex([[{ weight: null }, header], body])

  // expose split parts
  table.header = header
  table.row = row
  table.body = body

  return table
}

table.normalizeColumnArgs = normalizeColumnArgs

module.exports = table
