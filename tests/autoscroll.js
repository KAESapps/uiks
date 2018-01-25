var scroll = require("smooth-move")

const wrapper = require("../reaks/ctx-level-helpers/wrapper")

module.exports = wrapper(() => element =>
  setTimeout(
    () =>
      scroll(element, {
        x: 0,
        y: 50000,
        duration: 5000,
        ease: "linear",
      }),
    2000
  )
)
