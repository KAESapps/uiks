const wrapper = require("./ctx-level-helpers/wrapper")
const style = require("reaks/style")
const isFunction = require("lodash/isFunction")

module.exports = wrapper(backgroundColor =>
  style(
    isFunction(backgroundColor)
      ? () => ({
          backgroundColor: backgroundColor(),
        })
      : { backgroundColor }
  )
)
