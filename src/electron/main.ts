import { BrowserWindow, app } from "electron"
import path from "path"

import {
  createIfNotExitFoldersDirectory,
  getFoldersDirectories,
  saveFoldersDirectories,
  selectFolder,
} from "./folderManager.js"
import { createMenu } from "./menu.js"
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js"
import { createTray } from "./tray.js"
import { ipcMainAsyncHandle, ipcMainHandle, ipcMainOn, isDev } from "./util.js"

app.on("ready", () => {
  createIfNotExitFoldersDirectory()

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    icon: path.join(getAssetPath(), "trayIcon.png"),
    resizable: false,
    width: 475,
    height: 600,
    show: false,
  })

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123")
  } else {
    mainWindow.loadFile(getUIPath())
  }

  ipcMainHandle("getFolderDirectories", getFoldersDirectories)

  ipcMainOn("saveFoldersData", (data: Folders) => saveFoldersDirectories(data))

  ipcMainAsyncHandle("selectFolder", () => selectFolder(mainWindow))

  createMenu()
  createTray(mainWindow)
  handleCloseEvents(mainWindow)
})

const handleCloseEvents = (mainWindow: BrowserWindow) => {
  let willClose = false

  mainWindow.on("close", (e) => {
    if (willClose) {
      return
    }

    e.preventDefault()
    mainWindow.hide()
  })

  app.on("before-quit", () => {
    willClose = true
  })

  mainWindow.on("show", () => {
    willClose = false
  })
}
