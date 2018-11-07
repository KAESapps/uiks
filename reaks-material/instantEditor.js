const datePicker = require("./datePicker")
const formatValue = require("uiks/core/formatValue")
const textInputLook = require("./textInputLook")
const size = require("uiks/reaks/size")
const align = require("uiks/reaks/align")
const label = require("uiks/reaks/label")
const formatDate = require("reactivedb/operators/formatDate")

const textFieldDisplayer = formatter =>
  size(
    { wMin: 86 },
    align({ v: "bottom" }, textInputLook(formatValue(formatter, label())))
  )

const dialogEditor = require("./dialogEditor")

module.exports = ({ precision }) =>
  dialogEditor(
    datePicker({ precision }),
    textFieldDisplayer(val =>
      formatDate(val, {
        year: "numeric",
        month: precision !== "year" ? "numeric" : undefined,
        day: precision === "day" ? "numeric" : undefined,
      })
    )
  )
