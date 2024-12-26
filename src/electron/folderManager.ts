import { BrowserWindow, dialog } from "electron"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"

import { getStoragePath, getTempPath } from "./pathResolver.js"

export const selectFolder = async (mainWindow: BrowserWindow) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  })

  if (!result.canceled) {
    return result.filePaths[0]
  } else {
    return ""
  }
}

export const createIfNotExitFoldersDirectory = () => {
  const baseFile: Folders = {
    input: "",
    output: "",
  }

  const dataDir = getStoragePath()
  const tempDir = getTempPath()

  const existFolder = existsSync(dataDir)
  const existTempDir = existsSync(tempDir)

  if (!existFolder) {
    writeFileSync(dataDir, JSON.stringify(baseFile))
  }

  if (!existTempDir) {
    mkdirSync(tempDir)
  }
}

export const getFoldersDirectories = () => {
  const dataDir = getStoragePath()

  const existFolder = existsSync(dataDir)

  if (!existFolder) {
    throw new Error("No data found")
  }

  const dt = readFileSync(dataDir).toString()
  const data: Folders = JSON.parse(dt)

  return data
}

export const saveFoldersDirectories = (data: Folders) => {
  const dataDir = getStoragePath()

  writeFileSync(dataDir, JSON.stringify(data))
}
