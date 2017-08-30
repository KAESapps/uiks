const wrapper = require("./ctx-level-helpers/wrapper")
const style = require("reaks/style")
const isFunction = require("lodash/isFunction")

module.exports = wrapper(textColor =>
  style(
    isFunction(textColor)
      ? () => ({
          color: textColor(),
        })
      : { color: textColor }
  )
)
