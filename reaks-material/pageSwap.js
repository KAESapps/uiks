const isString = require("lodash/isString")
const swap = require("reaks/swap")
const label = require("uiks/reaks/label").reaks

module.exports = pageGenerator => {
  return ctx => {
    const getPage = pageGenerator(ctx)
    return {
      title: swap(() => {
        const page = getPage()
        const title = page.title
        return isString(title) ? label(title) : title
      }),
      content: swap(() => {
        const page = getPage()
        return page.content
      }),
      action: swap(() => {
        const page = getPage()
        return page.action
      }),
    }
  }
}
