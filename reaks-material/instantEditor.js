const datePicker = require("./datePicker")
const formatValue = require("uiks/core/formatValue")
const textInputLook = require("./textInputLook")
const size = require("uiks/reaks/size")
const align = require("uiks/reaks/align")
const label = require("uiks/reaks/label")
const formatDateTime = require("reactivedb/operators/formatDateTime")

const textFieldDisplayer = formatter =>
  size(
    { wMin: 86 },
    align({ v: "bottom" }, textInputLook(formatValue(formatter, label())))
  )

const dialogEditor = require("./dialogEditor")

module.exports = (opts = {}) =>
  dialogEditor(
    datePicker(opts),
    textFieldDisplayer(val =>
      formatDateTime(val, { precision: opts.precision })
    )
  )
