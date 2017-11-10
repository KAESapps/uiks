const displayIf = require("./displayIf")
const child = require("reaks/child")
const seq = require("reaks/seq")
const range = require("lodash/range")
const scroll = require("./scroll")
const vPile = require("./vPile")
const size = require("./size")
const style = require("./style")
const value = require("../core/value")
const { observable } = require("kobs")
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

// nombre d'éléments pré-rendus avant et après
const nbExtraItems = 30
// distance de scroll en nombre d'éléments avant un re-rendu
// TODO: on pourrait plutôt se baser sur RAF non ?
const nbScrolledItemsBeforeRerender = 10

module.exports = ({ itemHeight, item }) =>
  withSize(
    swap(ctx => () => {
      const containerHeight = ctx.size().height

      if (!containerHeight) {
        return null
      }

      let nbItemsRendered =
        Math.ceil(containerHeight / itemHeight) + nbExtraItems * 2
      // nombre pair d'éléments
      nbItemsRendered -= nbItemsRendered % 2

      // start index = index du premier élément rendu
      const startIndex = observableDedupe(
        0,
        scrollTop =>
          Math.floor(
            scrollTop / itemHeight -
              (scrollTop / itemHeight) % nbScrolledItemsBeforeRerender
          ) - nbExtraItems
      )
      const setScrollTop = startIndex

      return style(
        { position: "relative", willChange: "transform" },
        size(
          { h: containerHeight },
          scroll(
            {
              onScroll: () => ev => setScrollTop(ev.target.scrollTop),
            },
            ctx =>
              scrollContentLayout({
                totalHeight: () => ctx.value().length * itemHeight,
                floatingLayerTopPosition: () => startIndex() * itemHeight,
                floatingContent: contextualize(
                  vPile(
                    range(0, nbItemsRendered).map(index =>
                      style(
                        // les éléments de pré-rendu au-delà du dernier élément ne doivent pas prendre de place dans le DOM
                        // pour ne pas agrandir la zone de scroll
                        ctx => () =>
                          startIndex() + index >= ctx.value().length && {
                            display: "none",
                          },
                        size(
                          { h: itemHeight },
                          value(
                            ctx => () => {
                              return ctx.value()[startIndex() + index]
                            },
                            item
                          )
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
