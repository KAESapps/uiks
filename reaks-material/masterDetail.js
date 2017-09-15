const hFlex = require("../reaks/hFlex")
const displayIf = require("../reaks/displayIf")
const zPile = require("../reaks/zPile")
const align = require("../reaks/align")
const border = require("../reaks/border")
const iconButton = require("./iconButton")
const closeIcon = require("./icons/content/clear")

module.exports = ({ master, detail }) =>
  hFlex([
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
          zPile([
            detail,
            align(
              { h: "right" },
              iconButton(
                ctx => ({
                  icon: closeIcon,
                  color: ctx.colors.iconDefault,
                }),
                ctx => () => ctx.setActiveItem(null)
              )
            ),
          ])
        )
      ),
    ],
  ])
