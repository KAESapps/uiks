const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const swap = require("reaks/swap")
const { Obs } = require('reactivedb/obs')

/* prend un promise de context en argument et instancie la vue "success" avec ce contexte, en attendant il affiche la vue "loading" et en cas d'erreur, la vue "error" */
module.exports = (arg, views) => ctx => {
  const ctxPromise = isFunction(arg) ? arg(ctx) : arg
  const currentView = new Obs(views['loading'](ctx)) // on démarre avec la vue de loading
  ctxPromise.then(
    successCtx => currentView.set(views['success'](successCtx)),
    error => currentView.set(views['error'](create(ctx, {error})))
  )
  return swap(currentView.get.bind(currentView))
}