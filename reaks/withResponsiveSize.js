const isNumber = require("lodash/isNumber")
const seq = require("reaks/seq")
const create = require("lodash/create")
const { observable } = require("reactivedb/obs")
const sizeDetector = require("./sizeDetector")

const widthDetector = setWidth =>
  sizeDetector(node => setWidth(node.offsetWidth))

const observableDedupe = function(initValue, mapValue) {
  let prevValue = mapValue(initValue)
  const obs = observable(prevValue)
  return function(val) {
    if (arguments.length) {
      // set
      const mappedVal = mapValue(val)
      if (prevValue !== mappedVal) {
        prevValue = mappedVal
        obs(mappedVal)
      }
    } else {
      return obs()
    }
  }
}

module.exports = (mapWidth, wrappedCmp) => {
  // if first arg is a number, it is a simple narrow/large breakpoint
  if (isNumber(mapWidth)) {
    const breakWidth = mapWidth
    mapWidth = width => (width > breakWidth ? "large" : "narrow")
  }

  return ctx => {
    const responsiveObs = observableDedupe(null, width => {
      if (width === null) return

      return mapWidth(width)
    })

    return seq([
      widthDetector(responsiveObs),
      wrappedCmp(
        create(ctx, {
          responsiveSize: responsiveObs,
        })
      ),
    ])
  }
}
