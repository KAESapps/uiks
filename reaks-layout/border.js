const style = require("reaks/style")
const assign = require("lodash/assign")
const defaults = require("lodash/defaults")
const mapValues = require("lodash/mapValues")
const fromPairs = require("lodash/fromPairs")

const defaultPartialArg = {
  width: 1,
  type: "solid",
  color: "#CCC",
}

const allBorders = partialArg =>
  fromPairs(["t", "r", "b", "l"].map(s => [s, partialArg]))

const borderStyle = v => v && `${v.width}px ${v.type} ${v.color}`

module.exports = (borders = allBorders(defaultPartialArg)) => {
  if (borders.all) {
    borders = assign(allBorders(borders.all), borders)
  }
  borders = mapValues(borders, border =>
    defaults({}, border, defaultPartialArg)
  )

  const { t, r, b, l } = borders
  return style({
    borderTop: borderStyle(t),
    borderRight: borderStyle(r),
    borderBottom: borderStyle(b),
    borderLeft: borderStyle(l),
  })
}
