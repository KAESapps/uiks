const create = require("lodash/create")
const { observable } = require("kobs")
const seq = require("reaks/seq")
const sizeDetector = require("./sizeDetector")

module.exports = cmp => ctx => {
  const size = observable(null)
  let destroy
  const reaksCmp = cmp(create(ctx, { size }))
  return seq([
    sizeDetector(node => {
      if (node.offsetParent === null) return
      size({
        height: node.offsetHeight,
        width: node.offsetWidth,
      })
      if (!destroy) {
        // create cmp when size is detected
        destroy = reaksCmp(node)
      }
    }),
    () => () => {
      destroy && destroy()
      destroy = null
    },
  ])
}
