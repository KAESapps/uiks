const defaults = require("lodash/defaults")
const isFunction = require("lodash/isFunction")
const label = require("../reaks/label").reaks
const hFlex = require("../reaks-layout/hFlex")
const vFlex = require("../reaks-layout/vFlex")
const swap = require("reaks/swap")
const seq = require("reaks/seq")
const { observable } = require("reactivedb/obs")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const align = require("../reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const contextualizeOrderedArgs = require("../reaks/ctx-level-helpers/contextualizeOrderedArgs")

const rksTabs = function(opts, tabArgs) {
  if (arguments.length === 1) {
    tabArgs = opts
    opts = {
      backgroundColor: colors.teal["700"],
      activeTextColor: "white",
      inactiveTextColor: colors.teal["100"],
    }
  }

  const { backgroundColor, activeTextColor, inactiveTextColor } = opts

  const getActiveTab = observable(0, "activeTab")
  return vFlex([
    [
      { weight: null },
      seq([
        style({
          backgroundColor,
          textTransform: "uppercase",
          fontSize: "14px",
          fontWeight: 500,
          borderBottom: "1px solid lightgray",
        }),
        hFlex(
          tabArgs.map((tabArg, i) =>
            seq([
              label(tabArg[0]),
              clickable(() => getActiveTab(i)),
              size({ h: 48 }),
              align({ h: "center", v: "center" }),
              style(() => ({
                color:
                  getActiveTab() === i ? activeTextColor : inactiveTextColor,
                borderBottom:
                  getActiveTab() === i ? `4px solid ${activeTextColor}` : null,
              })),
            ])
          )
        ),
      ]),
    ],
    swap(() => tabArgs[getActiveTab()][1]),
  ])
}

module.exports = ctxCmp(rksTabs, function(opts, tabArgs) {
  if (arguments.length === 1) {
    tabArgs = opts
  }
  return [
    ctx =>
      defaults({}, isFunction(opts) ? opts(ctx) : opts, {
        backgroundColor: ctx.colors.primary,
        activeTextColor: ctx.colors.textOnPrimary,
        inactiveTextColor: ctx.colors.fadedTextOnPrimary,
      }),
    ctx => contextualizeOrderedArgs(tabArgs, ctx),
  ]
})
