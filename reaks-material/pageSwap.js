const isString = require("lodash/isString")
const get = require("lodash/get")
const swap = require("reaks/swap")
const label = require("uiks/reaks/label").reaks
const { observable } = require("kobs")

module.exports = (pageGenerator, opts = {}) => {
  return ctx => {
    const getPage = observable(pageGenerator(ctx))
    return {
      title: swap(() => {
        const page = getPage()
        const title = get(page, "title")
        return isString(title) ? label(title) : title
      }),
      content: swap(() => {
        const page = getPage()
        return get(page, "content")
      }),
      action: swap(() => {
        const page = getPage()
        return get(page, "action")
      }),
      minWidthAsChildPanel: opts.minWidthAsChildPanel,
      minWidthAsParentPanel: opts.minWidthAsParentPanel,
    }
  }
}
