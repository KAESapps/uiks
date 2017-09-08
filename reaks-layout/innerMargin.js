const style = require("reaks/style")
const isNumber = require("lodash/isNumber")
const fromPairs = require("lodash/fromPairs")

module.exports = (arg = 20) => {
  if (isNumber(arg)) {
    arg = fromPairs(["t", "r", "b", "l"].map(s => [s, arg]))
  }
  if (arg.v) {
    arg.t = arg.b = arg.v
  }
  if (arg.h) {
    arg.r = arg.l = arg.h
  }
  const { t, r, b, l } = arg

  return style({
    paddingTop: `${t}px`,
    paddingRight: `${r}px`,
    paddingBottom: `${b}px`,
    paddingLeft: `${l}px`,
  })
}
