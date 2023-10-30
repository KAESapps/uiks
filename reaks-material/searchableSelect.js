const concat = require("lodash/concat")
const assignObservable = require("uiks/core/assignObservable")
const observableAsValue = require("uiks/core/observableAsValue")
const vFlex = require("uiks/reaks/vFlex")
const hFlex = require("uiks/reaks/hFlex")
const size = require("uiks/reaks/size")
const valueLoadingAs = require("uiks/reactivedb/valueLoadingAs")
const selectableList = require("uiks/reaks/selectableList")
const dialog = require("uiks/reaks-material/dialog")
const textInput = require("uiks/reaks-material/textInput")
const icon = require("uiks/reaks-material/icon")
const searchIcon = require("uiks/reaks-material/icons/action/search")

module.exports = ({ title, listValue, itemLabel, actions }) =>
  dialog({
    title,
    minHeight: 400,
    content: assignObservable(
      {
        search: null,
      },
      size(
        { h: 300 },
        vFlex({ gap: 12 }, [
          [
            "fixed",
            hFlex({ align: "center", gap: 5 }, [
              [
                "fixed",
                icon({
                  icon: searchIcon,
                  color: ctx => ctx.colors.fadedDarkText,
                }),
              ],
              observableAsValue(
                "search",
                textInput({ placeholder: "Recherche", autoFocus: true })
              ),
            ]),
          ],
          selectableList({
            value: valueLoadingAs([], listValue),
            itemLabel,
            onSelect: ctx => v => {
              ctx.setValue(v)
              ctx.closePopup()
            },
          }),
        ])
      )
    ),
    actions,
  })
