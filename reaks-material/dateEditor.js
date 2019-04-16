const datePicker = require("./datePicker")
const formatValue = require("uiks/core/formatValue")
const textInputLook = require("./textInputLook")
const size = require("uiks/reaks/size")
const align = require("uiks/reaks/align")
const label = require("uiks/reaks/label")
const formatDate = require("reactivedb/operators/formatDate")

const textFieldDisplayer = size(
  { wMin: 100 },
  align({ v: "bottom" }, textInputLook(formatValue(formatDate, label())))
)

const dialogEditor = require("./dialogEditor")

module.exports = dialogEditor(datePicker(), textFieldDisplayer)
