const defaults = require("lodash/defaults")
const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const label = require("../reaks/label").reaks
const hFlex = require("../reaks-layout/hFlex")
const vFlex = require("../reaks-layout/vFlex")
const swap = require("reaks/swap")
const seq = require("reaks/seq")
const { observable, observe } = require("kobs")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const align = require("../reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const contextualizeOrderedArgs = require("../reaks/ctx-level-helpers/contextualizeOrderedArgs")
const switcherPreload = require("../reaks/switcherPreload").reaks

const basicSwitcher = (tabArgs, getActiveTab) =>
  swap(() => tabArgs[getActiveTab()][1])

const preloadedContentSwitcher = (tabArgs, getActiveTab) =>
  switcherPreload(tabArgs.map(t => t[1]), getActiveTab)

const rksTabs = function (opts, tabArgs) {
  if (arguments.length === 1) {
    tabArgs = opts
    opts = {
      backgroundColor: colors.teal["700"],
      activeTextColor: "white",
      inactiveTextColor: colors.teal["100"],
    }
  }

  const {
    backgroundColor,
    activeTextColor,
    inactiveTextColor,
    preload = false,
    getActiveTab = observable(0, "activeTab"),
  } = opts

  const contentSwitcher = preload ? preloadedContentSwitcher : basicSwitcher

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
    contentSwitcher(tabArgs, getActiveTab),
  ])
}

module.exports = ctxCmp(rksTabs, function (opts, tabArgs) {
  if (arguments.length === 1) {
    tabArgs = opts
  }

  const getActiveTab = observable(0, "activeTab")

  return [
    ctx =>
      defaults(
        {
          getActiveTab,
        },
        isFunction(opts) ? opts(ctx) : opts,
        {
          backgroundColor: ctx.colors.primary,
          activeTextColor: ctx.colors.textOnPrimary,
          inactiveTextColor: ctx.colors.fadedTextOnPrimary,
        }
      ),
    ctx =>
      contextualizeOrderedArgs(
        tabArgs.map((tabArg, i) => {
          return [
            tabArg[0],
            // s'abonne à getActiveTab et maintient une version filtrée (mais détachée) de isActiveTab dans le contexte de chacun des enfants
            ctx => {
              let currentIsActiveTabValue = false
              const isActiveTab = observable(currentIsActiveTabValue, 'isActiveTab-' + i)
              const cancel = observe(() => getActiveTab() === i, newIsActiveTabValue => {
                if (newIsActiveTabValue !== currentIsActiveTabValue) {
                  currentIsActiveTabValue = newIsActiveTabValue
                  isActiveTab(currentIsActiveTabValue)
                }
              })()
              const subCtx = create(ctx, {
                isActiveTab,
              })
              return seq([
                () => cancel,
                tabArg[1](subCtx),
              ])
            },
          ]
        }),
        ctx
      ),
  ]
})
