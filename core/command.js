const create = require("lodash/create")
const { observable } = require("reactivedb/obs")

module.exports = (makePromise, cmp) => ctx => {
  const makeCtxPromise = makePromise(ctx)
  const promiseObs = observable({ status: "idle" })

  const trigger = () => {
    promiseObs({
      status: "waiting",
    })
    return makeCtxPromise()
      .then(result => {
        promiseObs({
          status: "success",
          result,
        })
      })
      .catch(result => {
        promiseObs({
          status: "error",
          result,
        })
      })
  }

  return cmp(
    create(ctx, {
      command: {
        status: () => promiseObs().status,
        result: () => promiseObs().result,
        trigger,
      },
    })
  )
}
