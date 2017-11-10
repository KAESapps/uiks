const { observable } = require("kobs")

module.exports = ls => {
  const cache = new Map()
  const getValue = key => {
    let obs = cache.get(key)
    if (!obs) {
      obs = observable(JSON.parse(ls.getItem(key)))
      cache.set(key, obs)
    }
    return obs()
  }
  const setValue = (key, value) => {
    const obs = cache.get(key)
    if (obs) obs(value)
    ls.setItem(key, JSON.stringify(value))
  }
  return { getValue, setValue }
}
