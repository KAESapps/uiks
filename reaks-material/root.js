const style = require("reaks/style")
const seq = require("reaks/seq")
const insertCss = require("insert-css")
const fontFaceRule = require("font-face-rule")
const wrapper = require("../reaks/ctx-level-helpers/wrapper")

module.exports = wrapper(
  ({ getFileUrl }) =>
    seq([
      // add font-face rules
      () => {
        const rules = [
          fontFaceRule("Roboto", {
            src: [`url('${getFileUrl("Roboto-Regular.woff")}')`],
            "font-weight": "normal",
            "font-style": "normal",
          }),
          fontFaceRule("Roboto", {
            src: [`url('${getFileUrl("Roboto-Medium.woff")}')`],
            "font-weight": "500",
            "font-style": "normal",
          }),
          fontFaceRule("Roboto", {
            src: [`url('${getFileUrl("Roboto-Bold.woff")}')`],
            "font-weight": "bold",
            "font-style": "normal",
          }),
        ]
        const styleElement = insertCss(rules.join("\n"))
        return () => styleElement.parentElement.removeChild(styleElement)
      },
      style({
        fontFamily: "Roboto",
      }),
    ]),
  {
    mapArgs: function() {
      if (arguments.length === 1) {
        return arguments
      } else {
        return [
          {
            getFileUrl: ctx => ctx.getFileUrl,
          },
        ]
      }
    },
  }
)
