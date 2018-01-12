const create = require("lodash/create")
const { observable } = require("kobs")
const seq = require("reaks/seq")
const sizeDetector = require("./sizeDetector")

module.exports = cmp => ctx => {
  const size = observable(null)
  let loading = true
  const reaksCmp = cmp(create(ctx, { size }))
  return seq([
    sizeDetector(node => {
      size({
        height: node.offsetHeight,
        width: node.offsetWidth,
      })
      if (loading) {
        reaksCmp(node)
        loading = false
      }
    }),
  ])
}
