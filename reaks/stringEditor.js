const child = require('reaks/child')
const seq = require('reaks/seq')
const attr = require('reaks/attr')
const onEvent = require('reaks/onEvent')
const createInput = () => document.createElement('input')
module.exports = ctx =>
  child(
    seq([
      onEvent('change', ev => ctx.setValue(ev.target.value)),
      attr('value', () => ctx.getValue() || ''),
    ]),
    createInput
  )
