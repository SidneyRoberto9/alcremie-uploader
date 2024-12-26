import { Menu } from "electron"

export const createMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([]))
}
