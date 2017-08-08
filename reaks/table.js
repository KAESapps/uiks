const isObject = require("lodash/isPlainObject")
const isNumber = require("lodash/isNumber")
const defaults = require("lodash/defaults")
const assign = require("lodash/assign")
const hFlex = require("./hFlex")
const vFlex = require("./vFlex")
const scroll = require("./scroll")
const list = require("./list")
const align = require("./align")
const margin = require("./margin")
const border = require("./border")
const group = require("./group")

const wrapper = require("./ctx-level-helpers/wrapper")
const size = wrapper(require("reaks/size"))

const convertArgs = args => {
  return args.map(itemArg => {
    let opts = itemArg[0]
    let normalizedItemArg
    if (!isObject(opts)) {
      // if not an object, it's the header component
      normalizedItemArg = [
        {
          header: opts,
        },
        itemArg[1],
      ]
    } else {
      normalizedItemArg = itemArg
    }

    defaults(normalizedItemArg[0], {
      hAlign: "left",
    })
    return normalizedItemArg
  })
}

const createCell = itemArg => {
  let [opts, cellContent] = itemArg
  let cell = cellContent
  if (!opts.noAlignWrapper) {
    cell = align({ h: opts.hAlign, v: "center" }, cell)
  }
  if (opts.margin) {
    cell = margin(opts.margin, cell)
  }
  if (isNumber(opts.width)) {
    cell = [{ weight: null }, size({ w: opts.width }, cell)]
  }
  return cell
}

const createColumnHeader = itemArg => {
  let opts = itemArg[0]
  return createCell([assign({}, opts, { noAlignWrapper: false }), opts.header])
}

module.exports = function(arg1, arg2) {
  let opts, args
  if (arguments.length === 1) {
    args = arg1
    opts = {}
  } else {
    opts = arg1
    args = arg2
  }

  let row = border({ t: true }, hFlex(args.map(createCell)))
  if (opts.rowMixin) {
    row = group([row, opts.rowMixin])
  }

  args = convertArgs(args)
  return vFlex([
    [{ weight: null }, hFlex(args.map(createColumnHeader))],
    scroll(list(row)),
  ])
}
