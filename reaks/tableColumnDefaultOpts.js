const assign = require("lodash/assign")
const defaults = require("lodash/defaults")
const isString = require("lodash/isString")
const label = require("uiks/reaks/label")
const component = require("uiks/reaks/ctx-level-helpers/component")
const style = require("reaks/style")
const seq = require("reaks/seq")

const columnHeader = component(
  arg => seq([arg, style({ fontSize: 12 })]),
  arg => (isString(arg) ? [label({ wrap: true }, arg)] : [arg])
)
module.exports = (colOpts, c, colsArg) => {
  if (c === 0) {
    colOpts = defaults({}, colOpts, {
      margin: { l: 8 },
    })
  }
  if (c === colsArg.length - 1) {
    colOpts = defaults({}, colOpts, {
      margin: { r: 8 },
    })
  }
  colOpts = assign({ growable: true }, colOpts, {
    header: columnHeader(colOpts.header),
  })
  return colOpts
}
