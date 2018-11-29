const withResponsiveSize = require("../reaks/withResponsiveSize")
const menuIcon = require("./icons/navigation/menu")
const isString = require("lodash/isString")
const label = require("../reaks/label").reaks
const border = require("../reaks-layout/border")
const vFlex = require("../reaks-layout/vFlex")
const hFlex = require("../reaks-layout/hFlex")
const {
  parent: flexParentStyle,
  child: flexChildStyle,
} = require("../reaks-layout/flex/style")
const seq = require("reaks/seq")
const swap = require("reaks/swap")
const repeat = require("reaks/repeat")

const style = require("reaks/style")
const colors = require("material-colors")

const size = require("reaks/size")

const svgIcon = require("reaks/svgIcon")

const backIcon = require("./icons/navigation/arrowBack")
const closeIcon = require("./icons/content/clear")

const margin = require("../reaks-layout/margin")
const clickable = require("../reaks/clickable").reaksMixin

const previousPanelWidth = 500
const mainPanelMinWidth = 700

const create = require("lodash/create")
const { observable } = require("kobs")

const navigatorCore = args => ctx => {
  const { renderer, firstPage } = args
  let pages = []

  const lastPageIndex = observable(0, "navigator/lastPageIndex")

  const closePage = index => {
    if (index === 0) {
      return
    }
    const page = pages[index]
    if (!page) return

    if (page.canExit) {
      return page.canExit().then(res => {
        if (res !== true) return
        pages.pop()
        lastPageIndex(index - 1)
      })
    }
    pages.splice(index)
    lastPageIndex(index - 1)
  }

  const next = fromIndex => (page, ctx) => {
    if (page == null) {
      return closePage(fromIndex + 1)
    }

    pages.splice(
      fromIndex + 1,
      pages.length - fromIndex - 1,
      page(
        create(ctx, {
          next: next(fromIndex + 1),
          close: () => closePage(fromIndex + 1),
        })
      )
    )
    lastPageIndex(fromIndex + 1)
  }
  const back = () => {
    if (pages.length <= 1) return
    // supprime la dernière page
    pages.splice(-1)
    lastPageIndex(pages.length - 1)
  }
  const subCtx = create(ctx, { back, next: next(0) })
  pages.push(firstPage(subCtx))

  return seq([
    renderer(
      create(ctx, { pages, getPageIndex: lastPageIndex, closePage, back })
    ),
    () => {
      document.addEventListener("backbutton", back)
      return () => document.removeEventListener("backbutton", back)
    },
  ])
}

const appBar = function({
  page,
  backgroundColor = colors.teal["500"],
  textColor = colors.white,
  rootAction: getRootAction,
}) {
  const title = isString(page.title) ? label(page.title) : page.title

  return seq([
    hFlex({ align: "center" }, [
      [
        { weight: null },
        seq([
          size({ w: 56 }),
          margin({ l: 16 }),
          swap(() => {
            const rootAction = getRootAction()
            return seq([
              svgIcon(rootAction.icon, {
                size: { h: 24 },
                color: textColor,
              }),
              clickable(rootAction.action),
            ])
          }),
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

const renderer = withResponsiveSize(
  w => 1 + Math.floor(Math.max(0, w - mainPanelMinWidth) / previousPanelWidth),
  function(ctx) {
    const { pages, getPageIndex, back, responsiveSize, closePage } = ctx
    const getRange = observable(() => {
      const nbMaxPanels = responsiveSize() || 1
      const lastPageIndex = getPageIndex()

      const nbPanels = Math.min(lastPageIndex + 1, nbMaxPanels)

      const leftPageIndex = lastPageIndex + 1 - nbPanels

      return pages.slice(leftPageIndex, lastPageIndex + 1)
    })

    return seq([
      flexParentStyle({ orientation: "row" }),
      repeat(getRange, page => {
        const pageIndex = pages.indexOf(page)
        const rootAction = observable(() => {
          const leftPageIndex = pages.indexOf(getRange()[0])
          if (pageIndex === 0) {
            // side menu toggle on first panel
            return {
              icon: menuIcon,
              action: ctx.togglePanel,
            }
          } else {
            if (pageIndex === leftPageIndex && leftPageIndex > 0) {
              return {
                icon: backIcon,
                action: back,
              }
            } else if (pageIndex > leftPageIndex) {
              return {
                icon: closeIcon,
                action: () => closePage(pageIndex),
              }
            }
          }
        })

        return seq([
          flexChildStyle({
            weight: () => (pageIndex === getPageIndex() ? 1 : null),
          }),
          size({ w: previousPanelWidth }),
          border({ r: true }),
          vFlex([
            [
              "fixed",
              appBar({
                page,
                backgroundColor: ctx.colors.primary,
                textColor: ctx.colors.textOnPrimary,
                rootAction,
              }),
            ],
            page.content,
          ]),
        ])
      }),
    ])
  }
)

module.exports = function(page) {
  return navigatorCore({
    firstPage: page,
    renderer: renderer,
  })
}
