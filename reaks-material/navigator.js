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

const margin = require("../reaks-layout/margin")
const clickable = require("../reaks/clickable").reaksMixin

const appBar = function({
  page,
  pageIndex,
  back,
  backgroundColor = colors.teal["500"],
  textColor = colors.white,
  rootAction = {},
}) {
  const title = isString(page.title) ? label(page.title) : page.title

  const firstPage = pageIndex === 0

  const iconOpts = {
    size: { h: 24 },
    color: textColor,
  }
  const svgBackIcon = svgIcon(backIcon, iconOpts)
  const svgRootIcon = rootAction.icon
    ? svgIcon(rootAction.icon, iconOpts)
    : null

  return seq([
    hFlex({ align: "center" }, [
      [
        {
          weight: null,
        },
        seq([
          size({ w: 56 }),
          margin({ l: 16 }),
          firstPage ? svgRootIcon : svgBackIcon,
          firstPage
            ? rootAction.action ? clickable(rootAction.action) : null
            : clickable(back),
        ]),
      ],
      seq([title, style({ fontSize: 21, fontWeight: 500 })]),
      [{ weight: null }, seq([page.action, margin({ r: 10 })])],
    ]),
    style({
      backgroundColor,
      color: textColor,
    }),
    size({ h: 56 }),
  ])
}

const renderer = rootAction =>
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
            rootAction: rootAction && {
              icon: rootAction.icon,
              action: rootAction.action(ctx),
            },
          }),
        ],
        page.content,
      ])
    })
  }

module.exports = function(firstPage, opts) {
  return navigatorCore({
    firstPage,
    renderer: renderer(opts && opts.rootAction),
  })
}
