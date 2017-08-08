const child = require('reaks/child')
const onEvent = require('reaks/onEvent')
const createInput = () => document.createElement('input')

module.exports = createAction => ctx => {
  const action = createAction(ctx)
  return child(
    onEvent('change', ev => {
      const str = ev.target.value
      ev.target.value = ''
      action(str)
    }),
    createInput
  )
}
