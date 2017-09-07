const label = require("../reaks/label").reaks
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
const orderedArgs = require("../reaks/ctx-level-helpers/orderedArgs")

const rksTabs = tabArgs => {
  const getActiveTab = observable(0, "activeTab")
  return vFlex([
    [
      { weight: null },
      hFlex(
        tabArgs.map((tabArg, i) =>
          seq([
            label(tabArg[0]),
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
    swap(() => tabArgs[getActiveTab()][1]),
  ])
}

module.exports = orderedArgs(rksTabs)
