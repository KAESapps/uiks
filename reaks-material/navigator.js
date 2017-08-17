const isString = require("lodash/isString")
const navigatorCore = require("../reaks/navigator")
const label = require("../reaks/label").reaks
const vFlex = require("reaks-layout/vFlex")
const hFlex = require("reaks-layout/hFlex")
const seq = require("reaks/seq")
const swap = require("reaks/swap")

const style = require("reaks/style")
const colors = require("material-colors")

const childSvg = require("reaks/childSvg")
const size = require("reaks/size")
const attr = require("reaks/attrs")

const svgIcon = ({ path, viewBox }) => t =>
  childSvg(
    seq([
      style({ fill: "white" }),
      attr({ viewBox }),
      childSvg(seq([attr({ d: path })]), "path"),
      t,
    ])
  )

const svgBackIcon = svgIcon({
  path: "M40 22H15.66l11.17-11.17L24 8 8 24l16 16 2.83-2.83L15.66 26H40v-4z",
  viewBox: "0 0 48 48",
})

const align = ({ h, v }) =>
  style({
    display: "flex",
    alignItems: v,
    justifyContent: h,
  })

const margin = require("reaks-layout/margin")
const clickable = require("../reaks/reaks-level/clickable")

const appBar = function({
  page,
  pageIndex,
  back,
  backgroundColor = colors.teal["500"],
  textColor = colors.white,
}) {
  const title = isString(page.title) ? label(page.title) : page.title

  return seq([
    hFlex([
      pageIndex === 0
        ? [{ weight: null }, size({ w: 72 })]
        : [
            { weight: null },
            seq([
              size({ w: 72 }),
              align({ v: "center" }),
              margin({ l: 16 }),
              svgBackIcon(seq([size({ h: 24 })])),
              clickable(back),
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

const renderer = function(ctx) {
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
        }),
      ],
      page.content,
    ])
  })
}

module.exports = function(firstPage) {
  return navigatorCore({
    firstPage,
    renderer,
  })
}
