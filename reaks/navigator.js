const create = require("lodash/create")
const { observable } = require("kobs")
const seq = require("reaks/seq")

module.exports = args => ctx => {
  const { renderer, firstPage } = args
  const pages = []
  const pageIndex = observable(0, "navigator/pageIndex")
  const back = () => {
    const index = pageIndex()
    if (index === 0) {
      return
    }
    const page = pages[index]
    if (page.canExit) {
      return page.canExit().then(res => {
        if (res !== true) return
        pages.pop()
        pageIndex(index - 1)
      })
    }
    pages.pop()
    pageIndex(index - 1)
  }
  const next = (page, ctx) => {
    let ctxPage = page(ctx)
    // TODO: remove backward-compat one day
    if (!ctx) {
      console.warn("deprecated: navigator.next(): ctx should be provided")
      ctxPage = page
    }
    pages.push(ctxPage), pageIndex(pageIndex() + 1)
  }
  const subCtx = create(ctx, { back, next })
  pages.push(firstPage(subCtx))

  return seq([
    renderer(create(ctx, { pages, getPageIndex: pageIndex, back })),
    () => {
      document.addEventListener("backbutton", back)
      return () => document.removeEventListener("backbutton", back)
    },
  ])
}
