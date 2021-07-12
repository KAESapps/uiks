const observeRect = require("@reach/observe-rect").default
const debounce = require("lodash/debounce")

module.exports = onSizeChange => node => {
  let rectObserver = observeRect(
    node,
    debounce(rect => onSizeChange(node, rect), 100)
  )

  // start observing
  rectObserver.observe()

  // stop observing
  return () => rectObserver.unobserve()
}
