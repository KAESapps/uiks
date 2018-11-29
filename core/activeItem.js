// helper pour activer un item dans un tableau et le rendre visible et afficher la page suivante si possible
const create = require("lodash/create")

module.exports = (cbGenerator, nextPage) => ctx => {
  const cb = cbGenerator(ctx)
  const activeItem = item => {
    ctx.setActiveItem(item)
    ctx.ensureItemVisible(true)
    return nextPage && ctx.next(nextPage, create(ctx, { value: item }))
  }
  return arg => {
    const res = cb(arg)
    if (res.then) {
      return res.then(activeItem).catch(err => {
        ctx.alert({ title: "Erreur", message: err.message })
      })
    } else {
      return activeItem(res)
    }
  }
}
