const style = require("reaks/style")
const assign = require("lodash/assign")
const defaults = require("lodash/defaults")
const mapValues = require("lodash/mapValues")
const fromPairs = require("lodash/fromPairs")

const allBorders = partialArg =>
  fromPairs(["t", "r", "b", "l"].map(s => [s, partialArg]))

const borderStyle = v => v && `${v.width}px ${v.type} ${v.color}`

const defaultPartialArg = {
  width: 1,
  type: "solid",
  color: "#CCC",
}

module.exports = (arg = defaultPartialArg) => {
  const localDefaultPartialArg = defaults(
    {
      width: arg.width,
      type: arg.type,
      color: arg.color,
    },
    defaultPartialArg
  )
  if (arg.all || !(arg.t || arg.r || arg.b || arg.l)) {
    arg = assign(allBorders(arg.all), arg)
  }
  arg = mapValues(arg, border => defaults({}, border, localDefaultPartialArg))

  const { t, r, b, l } = arg
  return style({
    borderTop: borderStyle(t),
    borderRight: borderStyle(r),
    borderBottom: borderStyle(b),
    borderLeft: borderStyle(l),
  })
}
