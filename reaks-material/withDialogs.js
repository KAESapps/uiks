const create = require("lodash/create")
const withPopup = require("../reaks/withPopup")
const dialog = require("./dialog")
const confirm = require("./confirm")
const alert = require("./alert")
const contextualize = require("../reaks/ctx-level-helpers/contextualize")

module.exports = view =>
  withPopup(ctx => {
    console.warn("withDialogs is deprecated, please use withPopup")

    return view(
      create(ctx, {
        confirm: function(args) {
          console.warn(
            "ctx.confirm() is deprecated, please use uiks/reaks-material/confirm"
          )
          const ctx = this
          return new Promise(resolve =>
            confirm(create(args, { onClose: () => resolve }))(ctx)()
          )
        },
        alert: function(args) {
          console.warn(
            "ctx.alert() is deprecated, please use uiks/reaks-material/alert"
          )
          const ctx = this
          return new Promise(resolve =>
            alert(create(args, { onClose: () => resolve }))(ctx)()
          )
        },
        dialog: function({ title, content, actions = [] }) {
          console.warn(
            "ctx.dialog() is deprecated, please use uiks/reaks-material/dialog"
          )
          const ctx = this
          dialog({
            title,
            content: () => content,
            actions: actions.map(a => () => a),
          })(ctx)()
        },
        closeDialog: () => {
          console.warn(
            "ctx.closeDialog() is deprecated, please use ctx.closePopup()"
          )
          ctx.popup(false)
        },
      })
    )
  })
