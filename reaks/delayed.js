const align = require("../reaks-layout/align")
const label = require("./label").reaks
const loadingIndicator = align(
  { v: "center", h: "center" },
  label("Chargement ...")
)
module.exports = cmp => ctx => {
  const reaksCmp = cmp(ctx)
  return domNode => {
    let destroy = loadingIndicator(domNode)
    setTimeout(() => {
      destroy()
      destroy = reaksCmp(domNode)
    })
    return () => destroy && destroy()
  }
}
