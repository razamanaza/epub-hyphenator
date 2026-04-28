import { useState } from 'react'
import { FileText, Upload } from 'lucide-react'
import ErrorBanner from './ErrorBanner'
import { MAX_FILE_SIZE } from '@/shared/constants'

interface UploadFormData {
  file: File | null
}

function validateEpubFile(file: File | null): string | null {
  if (!file) {
    return 'Please select a file'
  }

  if (!file.name.toLowerCase().endsWith('.epub')) {
    return 'Please select a valid EPUB file'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 50MB'
  }

  return null
}

async function submitForm(uploadRequest: UploadFormData): Promise<void> {
  if (!uploadRequest.file) {
    throw new Error('No file selected')
  }

  const formData = new FormData()
  formData.append('file', uploadRequest.file)

  const response = await fetch('/api/process-epub', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorResult = await response.json()
    throw new Error(errorResult.error || 'Processing failed')
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/epub+zip')) {
    const blob = await response.blob()
    const contentDisposition = response.headers.get('content-disposition')
    const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/)
    const filename = filenameMatch ? filenameMatch[1] : 'hyphenated-file.epub'

    const downloadUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(downloadUrl)
  } else {
    const result = await response.json()
    throw new Error(result.error || 'Unexpected response format')
  }
}

export default function UploadForm() {
  const [formData, setFormData] = useState<UploadFormData>({ file: null })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFormData({ file })
    setError(null)
  }

  const processUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!formData.file) {
      setError('Please select an EPUB file')
      return
    }

    const fileError = validateEpubFile(formData.file)
    if (fileError) {
      setError(fileError)
      return
    }

    setIsSubmitting(true)
    try {
      await submitForm(formData)
      setError(null)
      setFormData({ file: null })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Upload EPUB File
          </h2>
          <p className="text-gray-600">
            Select an EPUB file to apply hyphenation. Language is detected
            automatically.
          </p>
        </div>

        {error && <ErrorBanner error={error} />}

        <form
          onSubmit={processUpload}
          className="space-y-6"
          data-testid="upload-form"
        >
          {/* File Input */}
          <div>
            <label
              htmlFor="file-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              EPUB File
            </label>
            <div className="relative">
              <input
                id="file-input"
                type="file"
                accept=".epub"
                onChange={updateFileSelection}
                className="hidden"
                disabled={isSubmitting}
              />
              <label
                htmlFor="file-input"
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isSubmitting
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.file
                      ? formData.file.name
                      : 'Click to select EPUB file'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 50MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.file}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Upload & Process'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
