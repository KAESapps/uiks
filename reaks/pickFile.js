module.exports = () => new Promise((resolve, reject) => {
  var fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.style.display = 'none'
  fileInput.addEventListener('change', function(ev) {
    document.body.removeChild(fileInput)
    if (ev.target.files.length > 0) {
      resolve(ev.target.files[0])
    }
  })

  document.body.appendChild(fileInput)
  fileInput.click()
})
