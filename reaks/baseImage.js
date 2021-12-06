const isFunction = require("lodash/isFunction")
const component = require("./ctx-level-helpers/component")
const child = require("reaks/child")
const attr = require("reaks/attr")
const attrs = require("reaks/attrs")
const seq = require("reaks/seq")
const style = require("reaks/style")

module.exports = component((src, { style: imgStyle } = {}) =>
  child(
    seq([isFunction(src) ? attr("src", src) : attrs({ src }), style(imgStyle)]),
    () => document.createElement("img")
  )
)
