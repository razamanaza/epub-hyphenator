import { useState } from 'react'
import { FileText, Languages, Upload } from 'lucide-react'
import ErrorBanner from './ErrorBanner'

type Language = 'en' | 'ru'

interface UploadFormData {
  file: File | null
  language: Language
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

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

  // Create FormData for multipart/form-data upload
  const formData = new FormData()
  formData.append('file', uploadRequest.file)
  formData.append('language', uploadRequest.language)

  try {
    const response = await fetch('/api/process-epub', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      // Handle error responses (JSON format)
      const errorResult = await response.json()
      throw new Error(errorResult.error || 'Processing failed')
    }

    // Check if response is binary (successful processing)
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/epub+zip')) {
      // Handle binary response - download the file
      const blob = await response.blob()

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition')
      const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/)
      const filename = filenameMatch ? filenameMatch[1] : 'hyphenated-file.epub'

      // Create download link and trigger click
      const downloadUrl = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = downloadUrl
      downloadLink.download = filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(downloadUrl)

      // Return success message for UI feedback
      return Promise.resolve()
    } else {
      // Handle unexpected JSON success response
      const result = await response.json()
      throw new Error(result.error || 'Unexpected response format')
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred during upload')
  }
}

export default function UploadForm() {
  const [formData, setFormData] = useState<UploadFormData>({
    file: null,
    language: 'en',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
    setError(null)
  }

  const handleLanguageChange = (language: Language) => {
    setFormData((prev) => ({ ...prev, language }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
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
      // Show success message and clear form
      setError(null)
      setFormData({ file: null, language: 'en' })
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
            Select an EPUB file and choose your preferred language for
            hyphenation processing
          </p>
        </div>

        {error && <ErrorBanner error={error} />}

        <form
          onSubmit={handleSubmit}
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
                onChange={handleFileChange}
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

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Languages className="w-4 h-4 inline mr-2" />
              Processing Language
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  formData.language === 'en'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                disabled={isSubmitting}
              >
                <div className="font-medium">English</div>
                <div className="text-sm opacity-75">en</div>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ru')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  formData.language === 'ru'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                disabled={isSubmitting}
              >
                <div className="font-medium">Russian</div>
                <div className="text-sm opacity-75">ru</div>
              </button>
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
