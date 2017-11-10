const create = require("lodash/create")
const { observable } = require("kobs")
const seq = require("reaks/seq")
const sizeDetector = require("./sizeDetector")

module.exports = cmp => ctx => {
  const size = observable({})
  return seq([
    sizeDetector(node =>
      size({
        height: node.offsetHeight,
        width: node.offsetWidth,
      })
    ),
    cmp(create(ctx, { size })),
  ])
}
