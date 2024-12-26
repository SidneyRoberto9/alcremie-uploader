type UploadOptions = {
  concurrency?: number
  onProgress?: (info: ProgressInfo) => void
  retryCount?: number
  retryDelay?: number
}

type UploadResult = {
  filePath: string
  success: boolean
  result?: any
  error?: string
}

type BatchUploadResult = {
  successful: UploadResult[]
  failed: UploadResult[]
  totalProcessed: number
  successCount: number
  failureCount: number
}

type ProgressInfo = {
  file: string
  batch: number
  totalBatches: number
  status: "started" | "completed" | "failed"
  error?: string
}

type Folders = {
  input: string
  output: string
}

type EventPayloadMapping = {
  selectFolder: string
  getFolderDirectories: Folders
  saveFoldersData: Folders
}

type UnsubscribeFunction = () => void

interface Window {
  electron: {
    selectFolder: () => Promise<string>
    getFolderDirectories: () => Promise<Folders>
    saveFoldersData: (data: Folders) => void
  }
}
