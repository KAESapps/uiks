const isFunction = require("lodash/isFunction")
const component = require("./ctx-level-helpers/component")
const child = require("reaks/child")
const attr = require("reaks/attr")
const attrs = require("reaks/attrs")
const seq = require("reaks/seq")
const style = require("reaks/style")
const size = require("reaks/size")

module.exports = component((src, { size: sizeArg, style: imgStyle } = {}) =>
  child(
    seq([
      isFunction(src) ? attr("src", src) : attrs({ src }),
      style({ display: "block" }),
      sizeArg && size(sizeArg),
      imgStyle && style(imgStyle),
    ]),
    () => document.createElement("img")
  )
)
