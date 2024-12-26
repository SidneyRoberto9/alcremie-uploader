import { AlertCircle, CheckCircle2, Folder } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/ui/components/ui/alert"
import { useFolders } from "@/ui/useFolders"

export const App = () => {
  const { folder, setFolder } = useFolders()

  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    if (!folder.input || !folder.output) {
      setError("Please select both directories.")

      return
    }

    window.electron.saveFoldersData(folder)

    setError("")
    setShowSuccess(true)

    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSelectDir = async (type: "input" | "output") => {
    const path = await window.electron.selectFolder()
    if (path) {
      setFolder((prev) => ({ ...prev, [type]: path }))
    }
  }

  const handleReset = () => {
    const value = {
      input: "",
      output: "",
    }
    setFolder(value)

    window.electron.saveFoldersData(value)
  }

  return (
    <div className="min-h-screen bg-[#242424] flex items-center justify-center p-2">
      <div className="w-full max-w-md space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-14 tracking-tight">
            Alcremie Uploader
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Input Directory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={folder.input}
                readOnly
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Select the directory..."
              />

              <button
                onClick={() => handleSelectDir("input")}
                className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Folder className="w-5 h-5 text-gray-200" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Output Directory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={folder.output}
                readOnly
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Select the directory..."
              />
              <button
                onClick={() => handleSelectDir("output")}
                className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Folder className="w-5 h-5 text-gray-200" />
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900 border-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showSuccess && (
            <Alert className="bg-green-900 border-green-600 text-white ">
              <CheckCircle2 className="size-4 stroke-white" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Settings were saved successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
