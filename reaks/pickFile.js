module.exports = ({ accept, multi } = {}) => {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = accept
    if (multi) fileInput.multiple = true
    fileInput.style.display = "none"
    document.body.appendChild(fileInput)

    //exécuté seulement si l'utilisateur sélectionne un fichier... mais après le onWindowFocus
    const onFilesChange = () => {
      resolve(multi ? Array.from(fileInput.files) : fileInput.files[0])
    }

    //éxécuté dans tous les cas (avant l'événement onFilesChange si l'utilisateur a sélectionné un fichier)
    //c'est pourquoi on met un timeout de 400ms pour faire un reject finalement si il n'y a pas eu de resolve avant
    const onWindowFocus = ev => {
      window.removeEventListener("focus", onWindowFocus)
      document.body.removeChild(fileInput)
      setTimeout(() => {
        fileInput.removeEventListener("change", onFilesChange)
        reject("canceled") // ne sert à rien s'il y a déjà eu un resolve avant
      }, 400)
    }

    fileInput.focus()
    fileInput.click()
    fileInput.addEventListener("change", onFilesChange)
    window.addEventListener("focus", onWindowFocus)
  })
}
