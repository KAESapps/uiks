const create = require("lodash/create")
const { observable } = require("kobs")
const seq = require("reaks/seq")
const sizeDetector = require("./sizeDetector")

module.exports = cmp => ctx => {
  const size = observable(null)
  let destroy
  const reaksCmp = cmp(create(ctx, { size }))
  return seq([
    sizeDetector((node, rect) => {
      size({
        height: rect.height,
        width: rect.width,
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
