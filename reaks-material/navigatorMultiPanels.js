const castArray = require("lodash/castArray")
const get = require("lodash/get")
const isString = require("lodash/isString")
const memoize = require("lodash/memoize")
const range = require("lodash/range")
const ctxAssign = require("../core/assign")
const withSize = require("../reaks/withSize")
const menuIcon = require("./icons/navigation/menu")
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

const defaultParentPanelMinWidth = 500
const defaultChildPanelMinWidth = 700

const create = require("lodash/create")
const { observable } = require("kobs")

const navigatorCore = args => ctx => {
  const { renderer, pages: customPages, lastPageIndex: getLastPageIndex } = args

  const lastPageIndex =
    (getLastPageIndex && getLastPageIndex(ctx)) ||
    observable(0, "navigator/lastPageIndex")

  // Créateur de page à partir de l'index
  const createPage = (i, baseCtx = ctx, pageCreator) => {
    if (!pageCreator) pageCreator = customPages[i]
    const pageCtx = create(baseCtx, {
      back,
      next: next(i),
      close: () => closePage(i),
    })
    const pg = pageCreator(pageCtx)
    pg.index = i // utile pour le renderer
    return pg
  }

  // memoize les pages créées
  // TODO : invalider une page si elle change
  const getPage = memoize(createPage)

  const closePage = index => {
    if (index === 0) {
      return
    }
    const page = getPage.cache.get(index)
    if (!page) return

    if (page.canExit) {
      return page.canExit().then(res => {
        if (res !== true) return
        pages.pop()
        lastPageIndex(index - 1)
      })
    }
    // pages.splice(index)
    lastPageIndex(index - 1)
  }
  const back = () => closePage(lastPageIndex())

  const next =
    fromIndex =>
    (pageCreator, ctx, { replace = false } = {}) => {
      let pageIndex = replace ? fromIndex : fromIndex + 1
      if (pageCreator == null) {
        return closePage(pageIndex)
      }

      const page = createPage(pageIndex, ctx, pageCreator)
      // màj du cache
      getPage.cache.set(pageIndex, page)
      lastPageIndex(pageIndex)
    }

  return seq([
    renderer(
      create(ctx, {
        getPage,
        getPageIndex: lastPageIndex,
        closePage,
        back,
      })
    ),
    () => {
      document.addEventListener("backbutton", back)
      return () => document.removeEventListener("backbutton", back)
    },
  ])
}

const getPanelWidth = (page, { last }) =>
  get(
    page,
    last ? "minWidthAsChildPanel" : "minWidthAsParentPanel",
    last ? defaultChildPanelMinWidth : defaultParentPanelMinWidth
  )

const appBar = function ({
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
            if (!rootAction) return null // arrive dans le cas d'un panneau masqué
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

const renderer = ({
  firstPanelRootAction,
  topBarBackgroundColor,
  topBarTextColor,
} = {}) =>
  withSize(function (ctx) {
    const { getPage, getPageIndex, back, size: availableSize, closePage } = ctx

    const getLeftPageIndex = observable(() => {
      let availableWidth = availableSize().width
      if (!availableWidth) return 0

      const lastPageIndex = getPageIndex()
      let i = lastPageIndex
      let page
      let stop = false
      do {
        page = getPage(i)
        const panelWidth = getPanelWidth(page, { last: i === lastPageIndex })
        availableWidth -= panelWidth
        if (availableWidth < 0) {
          // if available width < 0, current panel should not be displayed
          i = i + 1
          stop = true
        } else {
          // continue loop
          i--
        }
      } while (!stop && i >= 0)
      return Math.max(0, Math.min(i, lastPageIndex))
    })

    const getRange = observable(() => {
      const lastPageIndex = getPageIndex()
      // on fait appel à getPage ici pour s'assurer qu'un changement de page sans changement d'index provoque bien un rafraîchissement de la page qui change
      // (ex. pages affichées de 0 à 2, la page 2 change)
      return range(0, lastPageIndex + 1).map(i => getPage(i))
    })

    return seq([
      flexParentStyle({ orientation: "row" }),
      repeat(getRange, page => {
        const pageIndex = page.index

        const rootAction = observable(() => {
          const leftPageIndex = getLeftPageIndex()
          if (pageIndex === 0 && firstPanelRootAction) {
            // side menu toggle on first panel
            return {
              icon: firstPanelRootAction.icon,
              action: firstPanelRootAction.action(ctx),
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
          style(),
          style(() => {
            const last = pageIndex === getPageIndex()
            return {
              width: getPanelWidth(page, { last }),
              overflow: "hidden",
              flexGrow: last ? "2" : "1",
              flexShrink: "1",
              flexBasis: "auto",
            }
          }),
          border({ r: true }),
          vFlex([
            [
              "fixed",
              appBar({
                page,
                backgroundColor: topBarBackgroundColor(ctx),
                textColor: topBarTextColor(ctx),
                rootAction,
              }),
            ],
            page.content,
          ]),
          style(() => pageIndex < getLeftPageIndex() && { display: "none" }),
        ])
      }),
    ])
  })

module.exports = function (opts, pages) {
  if (!pages) {
    pages = opts
    opts = {}
  }

  const {
    firstPanelRootAction = {
      icon: menuIcon,
      action: ctx => ctx.togglePanel,
    },
    topBarBackgroundColor = ctx => ctx.colors.primary,
    topBarTextColor = ctx => ctx.colors.textOnPrimary,
  } = opts

  pages = castArray(pages)

  return ctxAssign(
    {
      fgColor: topBarTextColor,
    },
    navigatorCore({
      pages,
      renderer: renderer({
        firstPanelRootAction,
        topBarBackgroundColor,
        topBarTextColor,
      }),
      lastPageIndex: opts.lastPageIndex,
    })
  )
}
