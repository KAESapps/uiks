module.exports = (defaultValue, createGetValue) => ctx => {
  const getValue = createGetValue(ctx)
  return () => {
    const resp = getValue()
    if (!resp) return defaultValue
    return resp.loaded ? resp.value : defaultValue
  }
}
