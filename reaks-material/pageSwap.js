const isString = require("lodash/isString")
const swap = require("reaks/swap")
const label = require("uiks/reaks/label").reaks
const { observable } = require("kobs")

module.exports = pageGenerator => {
  return ctx => {
    const getPage = observable(pageGenerator(ctx))
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
