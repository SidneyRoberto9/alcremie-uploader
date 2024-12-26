import { WebContents, WebFrameMain, ipcMain } from "electron"
import { pathToFileURL } from "url"

import { getUIPath } from "./pathResolver.js"

export const isDev = (): boolean => {
  return process.env.NODE_ENV === "development"
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handle: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame!)
    return handle()
  })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handle: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    validateEventFrame(event.senderFrame!)
    handle(payload)
  })
}

export function ipcMainAsyncHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handle: () => Promise<EventPayloadMapping[Key]>
) {
  ipcMain.handle(key, async (event) => {
    validateEventFrame(event.senderFrame!)
    return await handle()
  })
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload)
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return
  }

  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event")
  }
}
