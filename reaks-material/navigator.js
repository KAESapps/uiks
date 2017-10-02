const isString = require("lodash/isString")
const navigatorCore = require("../reaks/navigator")
const label = require("../reaks/label").reaks
const vFlex = require("../reaks-layout/vFlex")
const hFlex = require("../reaks-layout/hFlex")
const seq = require("reaks/seq")
const swap = require("reaks/swap")

const style = require("reaks/style")
const colors = require("material-colors")

const size = require("reaks/size")

const svgIcon = require("reaks/svgIcon")

const backIcon = require("./icons/navigation/arrowBack")

const align = ({ h, v }) =>
  style({
    display: "flex",
    alignItems: v,
    justifyContent: h,
  })

const margin = require("../reaks-layout/margin")
const clickable = require("../reaks/clickable").reaksMixin

const appBar = function({
  page,
  pageIndex,
  back,
  backgroundColor = colors.teal["500"],
  textColor = colors.white,
  rootIconAction = {},
}) {
  const title = isString(page.title) ? label(page.title) : page.title

  const firstPage = pageIndex === 0

  const iconOpts = {
    size: { h: 24 },
    color: textColor,
  }
  const svgBackIcon = svgIcon(backIcon, iconOpts)
  const svgRootIcon = rootIconAction.icon
    ? svgIcon(rootIconAction.icon, iconOpts)
    : null

  return seq([
    hFlex([
      [
        { weight: null },
        seq([
          size({ w: 72 }),
          align({ v: "center" }),
          margin({ l: 16 }),
          firstPage ? svgRootIcon : svgBackIcon,
          firstPage
            ? rootIconAction.action ? clickable(rootIconAction.action) : null
            : clickable(back),
        ]),
      ],
      seq([title, style({ fontSize: "20px" }), align({ v: "center" })]),
      [
        { weight: null },
        seq([page.action, align({ v: "center" }), margin({ r: 10 })]),
      ],
    ]),
    style({
      backgroundColor,
      color: textColor,
    }),
    size({ h: 56 }),
  ])
}

const renderer = rootIconAction =>
  function(ctx) {
    const { pages, getPageIndex, back } = ctx
    return swap(function() {
      const pageIndex = getPageIndex()
      const page = pages[pageIndex]
      return vFlex([
        [
          { weight: null },
          appBar({
            page,
            pageIndex,
            back,
            backgroundColor: ctx.colors.primary,
            textColor: ctx.colors.textOnPrimary,
            rootIconAction: rootIconAction && {
              icon: rootIconAction.icon,
              action: rootIconAction.action(ctx),
            },
          }),
        ],
        page.content,
      ])
    })
  }

module.exports = function(firstPage, rootIconAction) {
  return navigatorCore({
    firstPage,
    renderer: renderer(rootIconAction),
  })
}
