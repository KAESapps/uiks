module.exports = ({ accept, multi } = {}) => {
  const fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.accept = accept
  fileInput.style.visibility = "hidden"
  if (multi) fileInput.multiple = true

  document.body.appendChild(fileInput)
  fileInput.focus()
  fileInput.click()

  return new Promise((resolve, reject) => {
    function checkFiles() {
      document.body.removeChild(this)

      if (this.files.length) {
        resolve(multi ? Array.from(this.files) : this.files[0])
      } else {
        reject(this.files)
      }
    }

    fileInput.addEventListener("focus", checkFiles, { once: true })
    fileInput.addEventListener("change", checkFiles, { once: true })
  })
}
