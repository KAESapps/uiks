const datePicker = require("./datePicker")
const formatValue = require("../core/formatValue")
const textInputLook = require("./textInputLook")
const size = require("../reaks/size")
const align = require("../reaks/align")
const label = require("../reaks/label")
const formatDateTime = require("reactivedb/operators/formatDateTime")
const switchBoolean = require("../reaks/switchBoolean")
const button = require("./flatButton")

const dateTimeDisplayer = opts =>
  size(
    { wMin: 100 },
    align(
      { v: "bottom" },
      textInputLook(formatValue(v => formatDateTime(v, opts), label()))
    )
  )

const dialogEditor = require("./dialogEditor")

module.exports = opts =>
  switchBoolean(
    ctx => {
      return ctx.readOnly
    },
    {
      truthy: dateTimeDisplayer(opts),
      falsy: dialogEditor(datePicker(opts), dateTimeDisplayer(opts), {
        customActions: [
          button("Effacer", ctx => () => {
            ctx.setValue(null)
            ctx.closePopup()
          }),
        ],
      }),
    }
  )
