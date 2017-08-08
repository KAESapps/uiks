const seq = require('reaks/seq')
const onEvent = require('reaks/onEvent')
const style = require('reaks/style')

module.exports = (action) => {
  return seq([onEvent('click', action), style({ cursor: 'pointer' })])
}
