import { useState } from 'react'
import { FileText, Languages, Upload } from 'lucide-react'
import ErrorBanner from './ErrorBanner'

type Language = 'en' | 'ru'

interface UploadFormData {
  file: File | null
  language: Language
}

type FormValidationError =
  | 'no-file'
  | 'invalid-file-type'
  | 'file-too-large'
  | 'unknown-error'

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

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed')
    }

    if (!result.success) {
      throw new Error(result.error || 'Processing failed')
    }

    // For now, just log the success message
    console.log('Upload successful:', result.message)

    // You could show a success message here instead of throwing an error
    // For now, we'll throw the message to show it works
    throw new Error(result.message)
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
      // Success handling would go here
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
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
