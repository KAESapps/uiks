const displayIf = require("./displayIf")
const child = require("reaks/child")
const seq = require("reaks/seq")
const range = require("lodash/range")
const scroll = require("./scroll")
const vPile = require("./vPile")
const size = require("./size")
const style = require("./style")
const value = require("../core/value")
const { observable } = require("reactivedb/obs")
const contextualize = require("./ctx-level-helpers/contextualize")
const withSize = require("./withSize")
const swap = require("./swap")

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

const scrollContentLayout = ({
  totalHeight,
  floatingLayerTopPosition,
  floatingContent,
}) =>
  seq([
    child(
      style.reaksMixin(() => ({
        height: totalHeight(),
      }))
    ),
    child(
      seq([
        floatingContent,
        style.reaksMixin({
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }),
        style.reaksMixin(() => ({
          transform: `translateY(${floatingLayerTopPosition()}px)`,
        })),
      ])
    ),
  ])

const nbExtraItems = 10

module.exports = ({ itemHeight, item }) =>
  withSize(
    swap(ctx => () => {
      const containerHeight = ctx.size().height

      if (!containerHeight) {
        return null
      }

      const startIndex = observableDedupe(0, scrollTop =>
        Math.floor(
          scrollTop / itemHeight - (scrollTop / itemHeight) % nbExtraItems
        )
      )
      const setScrollTop = startIndex
      const nbItemsDisplayed =
        Math.ceil(containerHeight / itemHeight) + nbExtraItems

      return style(
        { position: "relative", willChange: "transform" },
        size(
          { h: containerHeight },
          scroll(
            {
              onScroll: () => ev => {
                console.log(ev.target.scrollTop)
                setScrollTop(ev.target.scrollTop)
              },
            },
            ctx =>
              scrollContentLayout({
                totalHeight: () => ctx.value().length * itemHeight,
                floatingLayerTopPosition: () => startIndex() * itemHeight,
                floatingContent: contextualize(
                  vPile(
                    range(0, nbItemsDisplayed).map(index =>
                      displayIf(
                        ctx => () => startIndex() + index < ctx.value().length,
                        value(
                          ctx => () => {
                            return ctx.value()[startIndex() + index]
                          },
                          size({ h: itemHeight }, item)
                        )
                      )
                    )
                  ),
                  ctx
                ),
              })
          )
        )
      )
    })
  )
