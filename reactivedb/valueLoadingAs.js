module.exports = (defaultValue, createGetValue) => ctx => {
  const getValue = createGetValue(ctx)
  return () => 
    getValue().loaded ? getValue().value : defaultValue
}