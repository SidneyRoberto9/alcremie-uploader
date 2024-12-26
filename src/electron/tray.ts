import { BrowserWindow, Menu, Tray, app } from "electron"
import path from "path"

import {
  convertImageToJPEG,
  deleteFile,
  getItemsFromFolder,
  sendToAlcremie,
} from "./fileProcess.js"
import { getFoldersDirectories } from "./folderManager.js"
import { getAssetPath } from "./pathResolver.js"

export const createTray = (mainWindow: BrowserWindow) => {
  const tray = new Tray(path.join(getAssetPath(), "trayIcon.png"))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Configuration",
      click: () => {
        mainWindow.show()
        if (app.dock) {
          app.dock.show()
        }
      },
    },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ])

  tray.setToolTip("Alcremie Uploader")
  tray.setContextMenu(contextMenu)

  tray.on("click", async () => {
    const folder = getFoldersDirectories()

    const imagensFromInputPath = await getItemsFromFolder(folder.input)

    await Promise.all(imagensFromInputPath.map(convertImageToJPEG))

    await sendToAlcremie(folder.output, mainWindow)

    await Promise.all(imagensFromInputPath.map(deleteFile))
  })
}
