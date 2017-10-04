const hFlex = require("../reaks/hFlex")
const displayIf = require("../reaks/displayIf")
const vFlex = require("../reaks/vFlex")
const hPile = require("../reaks/hPile")
const border = require("../reaks/border")
const align = require("../reaks/align")
const innerMargin = require("../reaks/innerMargin")
const iconButton = require("./iconButton")
const closeIcon = require("./icons/content/clear")
const value = require("../core/value")

module.exports = ({ master, detail, detailActions }) => {
  return hFlex([
    master,
    [
      { weight: ctx => () => (ctx.activeItem() ? 1 : 0) },
      displayIf(
        ctx => ctx.activeItem,
        border(
          {
            l: {
              width: 1,
              color: "#ddd",
            },
          },
          value(
            ctx => ctx.activeItem,
            vFlex([
              [
                "fixed",
                border(
                  {
                    b: {
                      width: 1,
                      color: "#ddd",
                    },
                  },
                  hFlex([
                    innerMargin({ h: 16, v: 8 }, hPile(detailActions)),
                    [
                      "fixed",
                      align(
                        { v: "center" },
                        innerMargin(
                          { r: 8 },
                          iconButton(
                            ctx => ({
                              icon: closeIcon,
                              color: ctx.colors.iconDefault,
                            }),
                            ctx => () => ctx.setActiveItem(null)
                          )
                        )
                      ),
                    ],
                  ])
                ),
              ],
              detail,
            ])
          )
        )
      ),
    ],
  ])
}
