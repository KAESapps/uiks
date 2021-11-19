const isArray = require("lodash/isArray")
const isPlainObject = require("lodash/isPlainObject")
const isString = require("lodash/isString")
const isNumber = require("lodash/isNumber")
const assign = require("lodash/assign")
const attr = require("reaks/attr")
const assignObservable = require("../core/assignObservable")
const hFlex = require("./hFlex")
const vFlex = require("./vFlex")
const list = require("./list")
const align = require("./align")
const innerMargin = require("./innerMargin")
const backgroundColor = require("./backgroundColor")
const border = require("./border")
const group = require("./group")
const label = require("./label")
const size = require("./size")
const style = require("./style")
const scroll = require("./scroll")

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
    cell =
      cell &&
      style(
        { textAlign: opts.hAlign },
        align({ h: opts.hAlign, v: "center" }, cell)
      )
  }
  if (opts.margin) {
    cell = innerMargin(opts.margin, cell)
  }
  if (opts.bgColor) {
    cell = backgroundColor(opts.bgColor, cell)
  }
  cell = [
    { weight: opts.growable ? 1 : null, shrinkable: false },
    size({ w: opts.width || 0 }, cell),
  ]

  return cell
}

const createColumnHeader = itemArg => {
  let opts = itemArg[0]
  let headerContent = opts.header
  if (isString(opts.header)) {
    headerContent = label({ wrap: true }, opts.header)
  }
  return createCell([
    assign({}, opts, { noAlignWrapper: false }),
    headerContent,
  ])
}

const table = function (arg1, arg2) {
  let opts, args
  if (arguments.length === 1) {
    args = arg1
    opts = {}
  } else {
    opts = arg1
    args = arg2
  }

  args = normalizeColumnArgs(args)

  let row = size({ wMin: "100%" }, hFlex(args.map(createCell)))
  if (opts.rowMixin) {
    row = group([row, opts.rowMixin])
  }

  let header = border({ b: true }, hFlex(args.map(createColumnHeader)))
  if (opts.withHorizontalScroll) {
    header = group([ctx => attr("scrollLeft", ctx.scrollLeft), header])
  }

  const body = scroll(
    {
      onScroll:
        opts.withHorizontalScroll &&
        (ctx => ev => {
          const scrollLeftValue = ev.currentTarget.scrollLeft
          if (ctx.scrollLeft() !== scrollLeftValue)
            ctx.scrollLeft(scrollLeftValue)
        }),
    },
    style({ display: "flex", alignItems: "flex-start" }, list(row))
  )
  let table = vFlex([[{ weight: null }, header], body])
  if (opts.withHorizontalScroll) {
    table = assignObservable({ scrollLeft: 0 }, table)
  }

  // expose split parts
  table.header = header
  table.row = row
  table.body = body

  return table
}

table.normalizeColumnArgs = normalizeColumnArgs

module.exports = table
