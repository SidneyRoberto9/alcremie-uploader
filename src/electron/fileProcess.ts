import axios from "axios"
import { BrowserWindow, dialog } from "electron"
import FormData from "form-data"
import { createReadStream, existsSync } from "fs"
import { chmod, copyFile, mkdir, readdir, unlink } from "fs/promises"
import pLimit from "p-limit"
import path from "path"
import sharp from "sharp"

import { getTempPath } from "./pathResolver.js"

export const getItemsFromFolder = async (folderPath: string) => {
  const data = []

  try {
    const files = await readdir(folderPath, { withFileTypes: true })

    for (const file of files) {
      const filePath = path.join(folderPath, file.name)

      if (file.isFile()) {
        data.push(filePath)
      }
    }

    return data
  } catch (error) {
    throw new Error(`Erro ao buscar imagens: ${error}`)
  }
}

export const deleteFile = async (filePath: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await chmod(filePath, 0o666)
    await unlink(filePath)
  } catch (error) {
    console.error(
      `Erro ao remover atributo de somente leitura: ${(error as any).message}`
    )
  }
}

export const convertImageToJPEG = async (imagePath: string) => {
  try {
    if (!existsSync(imagePath)) {
      throw new Error("File not found")
    }

    const defaultOptions = {
      quality: 80,
      chromaSubsampling: "4:4:4",
    }

    const tempDir = getTempPath()

    const fileName = path.basename(imagePath).split(".")[0] + ".jpeg"
    const outPutDir = path.join(tempDir, fileName)

    sharp.cache(false)

    await sharp(imagePath).jpeg(defaultOptions).toFile(outPutDir)
  } catch (error) {
    throw new Error(`Failed to convert image: ${error}`)
  }
}

const requestToAlcremie = async (path: string) => {
  try {
    const apiURL = "https://sid933-alcremie-api.hf.space/api/upload"

    const formData = new FormData()

    formData.append("image", createReadStream(path))
    await axios.post(apiURL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
  } catch (error) {
    console.error("Erro ao enviar a imagem:", error)
  }
}

const moveFile = async (source: string, destination: string) => {
  try {
    const destinationDir = path.dirname(destination)
    await mkdir(destinationDir, { recursive: true })
    await copyFile(source, destination)
    await unlink(source)
  } catch (error) {
    console.error("Erro ao mover o arquivo:", error)
  }
}

export const sendToAlcremie = async (
  destinationPath: string,
  mainWindow: BrowserWindow
) => {
  const limit = pLimit(5)

  const inputItems = []

  const images = await getItemsFromFolder(getTempPath())

  for (const image of images) {
    inputItems.push(limit(() => requestToAlcremie(image)))
  }

  await Promise.all(inputItems)

  for (const image of images) {
    const fileName = path.basename(image)
    const endPath = path.join(destinationPath, fileName)

    await moveFile(image, endPath)
  }

  await dialog.showMessageBox(mainWindow, {
    type: "info",
    title: "Aviso",
    message: "Arquivos Enviados com sucesso!",
    buttons: ["OK"],
  })
}
