import { IpcRendererEvent } from "electron"

const electron = require("electron")

electron.contextBridge.exposeInMainWorld("electron", {
  selectFolder: () => ipcInvoke("selectFolder"),
  getFolderDirectories: () => ipcInvoke("getFolderDirectories"),
  saveFoldersData: (data: Folders) => ipcSend("saveFoldersData", data),
} satisfies Window["electron"])

function ipcInvoke<Key extends keyof EventPayloadMapping>(key: Key) {
  return electron.ipcRenderer.invoke(key)
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: IpcRendererEvent, payload: any) => callback(payload)

  electron.ipcRenderer.on(key, cb)

  return () => electron.ipcRenderer.off(key, cb)
}
