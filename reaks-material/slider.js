const child = require("reaks/child")
const seq = require("reaks/seq")
const style = require("reaks/style")
const attrs = require("reaks/attrs")
const attr = require("reaks/attr")
const onEvent = require("reaks/onEvent")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const defaults = require("lodash/defaults")
const assign = require("lodash/assign")
const range = require("lodash/range")
const { observable } = require("kobs")

const thumbSize = 18
const trackHeight = 4
const maxTicks = 20 // au delà, les graduations ne sont pas affichées
const thumbShadow = "0 1px 3px rgba(0, 0, 0, 0.3)"

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

const trackPart = (styleObj) =>
  assign(
    {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      borderRadius: trackHeight / 2 + "px",
    },
    styleObj
  )

// slider pour une valeur entière, la valeur peut être nulle (pas de curseur affiché)
// sur écran tactile, la valeur n'est modifiée qu'au glissement horizontal ou au tap,
// pour ne pas modifier la valeur lors d'un scroll vertical qui commence sur le slider
module.exports = ctxCmp(
  ({ value, setValue, min = 0, max = 100, step = 1, color }) =>
    (parentNode) => {
      const span = max - min
      // état propre à chaque montage
      const active = observable(false)
      const focused = observable(false)
      let pointerId = null
      let isTouch = false

      const ratio = () => {
        const v = value()
        return v == null || !span ? 0 : (clamp(v, min, max) - min) / span
      }
      const set = (v) => {
        v = clamp(v, min, max)
        if (v !== value()) setValue(v)
      }
      // la piste est en retrait d'un demi curseur de chaque côté
      const valueFromEvent = (ev) => {
        const rect = ev.currentTarget.getBoundingClientRect()
        const width = rect.width - thumbSize
        const r =
          width > 0
            ? clamp((ev.clientX - rect.left - thumbSize / 2) / width, 0, 1)
            : 0
        return min + Math.round((r * span) / step) * step
      }
      const end = () => {
        pointerId = null
        active(false)
      }

      const ticksCount = span / step
      const ticks =
        ticksCount > 1 && ticksCount <= maxTicks
          ? range(0, Math.floor(ticksCount) + 1).map((i) =>
              child(
                style({
                  position: "absolute",
                  left: ((i * step) / span) * 100 + "%",
                  top: "50%",
                  width: "2px",
                  height: "2px",
                  margin: "-1px 0 0 -1px",
                  borderRadius: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                })
              )
            )
          : []

      const track = child(
        seq([
          style({
            position: "absolute",
            left: thumbSize / 2 + "px",
            right: thumbSize / 2 + "px",
            top: "50%",
            height: trackHeight + "px",
            marginTop: -trackHeight / 2 + "px",
          }),
          // fond
          child(
            style(trackPart({ right: 0, backgroundColor: color, opacity: 0.25 }))
          ),
          // partie remplie
          child(
            seq([
              style(trackPart({ backgroundColor: color })),
              style(() => ({ width: ratio() * 100 + "%" })),
            ])
          ),
          seq(ticks),
          // curseur
          child(
            seq([
              style({
                position: "absolute",
                top: "50%",
                width: thumbSize + "px",
                height: thumbSize + "px",
                borderRadius: "50%",
                backgroundColor: color,
                transition: "transform 0.1s",
              }),
              style(() => ({
                left: ratio() * 100 + "%",
                display: value() == null ? "none" : "block",
                transform:
                  "translate(-50%, -50%)" + (active() ? " scale(1.2)" : ""),
                boxShadow: focused()
                  ? thumbShadow + ", 0 0 0 4px rgba(0, 0, 0, 0.1)"
                  : thumbShadow,
              })),
            ])
          ),
        ])
      )

      return child(
        seq([
          style({
            position: "relative",
            width: "100%",
            minWidth: "100px", // pas de largeur intrinsèque, contrairement à un input
            height: "100%",
            minHeight: thumbSize + 8 + "px",
            cursor: "pointer",
            touchAction: "pan-y",
            userSelect: "none",
            outline: "none",
          }),
          attrs({
            tabindex: 0,
            role: "slider",
            "aria-valuemin": min,
            "aria-valuemax": max,
          }),
          attr("ariaValueNow", () => {
            const v = value()
            return v == null ? null : String(v)
          }),
          track,
          onEvent("pointerdown", (ev) => {
            if (ev.button !== 0) return
            pointerId = ev.pointerId
            isTouch = ev.pointerType === "touch"
            ev.currentTarget.setPointerCapture(pointerId)
            ev.currentTarget.focus()
            active(true)
            if (!isTouch) set(valueFromEvent(ev))
          }),
          onEvent("pointermove", (ev) => {
            if (ev.pointerId === pointerId) set(valueFromEvent(ev))
          }),
          onEvent("pointerup", (ev) => {
            if (ev.pointerId !== pointerId) return
            if (isTouch) set(valueFromEvent(ev))
            end()
          }),
          // déclenché par le navigateur quand le geste devient un scroll vertical
          onEvent("pointercancel", (ev) => {
            if (ev.pointerId === pointerId) end()
          }),
          onEvent("keydown", (ev) => {
            const v = value()
            let newValue
            if (ev.key === "ArrowRight" || ev.key === "ArrowUp") {
              newValue = v == null ? min : v + step
            } else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") {
              newValue = v == null ? min : v - step
            } else if (ev.key === "Home") newValue = min
            else if (ev.key === "End") newValue = max
            else return
            ev.preventDefault()
            set(newValue)
          }),
          onEvent("focus", () => focused(true)),
          onEvent("blur", () => focused(false)),
        ])
      )(parentNode)
    },
  // defaults args from context
  function (arg) {
    return [
      defaults({}, arg, {
        value: (ctx) => ctx.value,
        setValue: (ctx) => ctx.setValue,
        color: (ctx) => ctx.colors.primary,
      }),
    ]
  }
)
