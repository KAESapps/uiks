const range = require("lodash/range")
const vListVirtualScroll = require("../reaks/vListVirtualScroll")
const table = require("../reaks/table")
const label = require("../reaks/label")
const button = require("../reaks-material/button")
const vFlex = require("../reaks/vFlex")
const value = require("../core/value")
const renderFullscreen = require("../reaks/renderFullscreen")
const { observable } = require("kobs")
const autoScroll = require("./autoscroll") && require("lodash/identity")

const nbItems = 10000
const defaultVisibleItem = (window.scrollTo = observable(0))

const data = (window.data = observable([]))
const scenario = [
  range(0, nbItems).reverse(),
  // [0, 4],
  // [3, 1],
  // [2, 4],
  // [2, 3],
  // [2, 5],
  // [1, 5],
  // [0],
  // [0, 3],
  // [3, 0],
  // [0, 3],
  // [3, 0],
  // [3, 2],
  // [],
]

const scenarioStep = i => {
  if (i < scenario.length) {
    data(scenario[i])
    setTimeout(() => {
      scenarioStep(i + 1)
    }, 500)
  }
}

// launch scenario
scenarioStep(0)

const nbRow = observable(1)

const { header, row } = table([
  [{ width: 100, header: "Plaquette" }, label(ctx => `item ${ctx.value}`)],
  ["Essence", label(ctx => (ctx.value % 2 ? "Chêne" : "Frêne"))],
  ["Qualité", label(ctx => (ctx.value % 2 ? "A" : "B"))],
  [
    { width: 120, header: "Volume (m³)" },
    label(() => (Math.random() * 10).toString()),
  ],
  [
    { width: 80, header: "Action" },
    button("add", ctx => () => {
      nbRow(nbRow() + 1)
    }),
  ],
  [
    { width: 80, header: "Action" },
    button("remove", ctx => () => {
      const dataArray = data()
      const idx = dataArray.indexOf(ctx.value)
      dataArray.splice(idx, 1)
      data(dataArray)
    }),
  ],
])

renderFullscreen(
  value(
    () => data,
    vFlex([
      ["fixed", header],
      autoScroll(
        vListVirtualScroll({
          itemHeight: id => (id === 9998 ? nbRow() * 36 : 36),
          item: row,
          getDefaultVisibleItem: () => defaultVisibleItem,
          disableEnsureItemVisible: () => () => defaultVisibleItem(null),
        })
      ),
    ])
  )
)({
  colors: { secondary: "darkblue", textOnSecondary: "white" },
})
