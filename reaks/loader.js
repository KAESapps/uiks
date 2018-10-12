const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const swap = require("reaks/swap")
const { Obs } = require("kobs")

/* prend un promise de context en argument et instancie la vue "success" avec ce contexte, en attendant il affiche la vue "loading" et en cas d'erreur, la vue "error" */
module.exports = (arg, views) => ctx => {
  const { loading, success, error: errorView } = views
  const currentView = new Obs(loading && loading(ctx)) // on démarre avec la vue de loading
  const load = ctxPromise =>
    ctxPromise.then(
      successCtx => currentView.set(success(create(ctx, successCtx))),
      error => {
        const subCtx = { error }
        if (isFunction(arg)) {
          subCtx.retry = () => load(arg(ctx))
        }
        return currentView.set(errorView && errorView(create(ctx, subCtx)))
      }
    )

  load(isFunction(arg) ? arg(ctx) : arg)

  return swap(currentView.get.bind(currentView))
}
