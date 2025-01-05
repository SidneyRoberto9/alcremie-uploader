import { useEffect, useState } from "react"

export const useFolders = () => {
  const [folder, setFolder] = useState<Folders>({
    input: "",
    output: "",
    saveToOutput: true,
  })

  useEffect(() => {
    window.electron.getFolderDirectories().then(setFolder)
  }, [])

  return { folder, setFolder }
}
