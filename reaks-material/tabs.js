const label = require("../reaks/label").reaks
const contextualize = require("../reaks/ctx-level-helpers/contextualize")
const hFlex = require("reaks-layout/hFlex")
const vFlex = require("reaks-layout/vFlex")
const swap = require("reaks/swap")
const seq = require("reaks/seq")
const { observable } = require("reactivedb/obs")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const align = require("reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")

const rksTabs = args => {
  const getActiveTab = observable(0, "activeTab")
  return vFlex([
    [
      { weight: null },
      hFlex(
        args.map((tab, i) =>
          seq([
            label(tab[0]),
            clickable(() => getActiveTab(i)),
            size({ h: 48 }),
            align({ h: "center", v: "center" }),
            style({
              backgroundColor: colors.teal["700"],
              textTransform: "uppercase",
              fontSize: "14px",
              fontWeight: 500,
            }),
            style(() => ({
              color: getActiveTab() === i ? "white" : colors.teal["100"],
            })),
          ])
        )
      ),
    ],
    swap(() => args[getActiveTab()][1]),
  ])
}

const orderedLayoutArgs = layout => args => ctx => {
  return layout(
    args.map(arg => arg.map(argPart => contextualize(argPart, ctx)))
  )
}

module.exports = orderedLayoutArgs(rksTabs)
