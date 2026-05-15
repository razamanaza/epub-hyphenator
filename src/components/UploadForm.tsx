import { useState } from 'react'
import { FileText, Upload } from 'lucide-react'
import ErrorBanner from './ErrorBanner'
import type { SupportedLanguage } from '@/shared/constants'
import { MAX_FILE_SIZE } from '@/shared/constants'

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  ru: 'Russian',
}

function validateEpubFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.epub')) {
    return 'Please select a valid EPUB file'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 50MB'
  }
  return null
}

async function detectLanguage(file: File): Promise<SupportedLanguage> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/detect-language', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    return 'en'
  }

  const result = (await response.json()) as { language: SupportedLanguage }
  return result.language
}

async function processEpub(file: File, language: SupportedLanguage): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('language', language)

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
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState<SupportedLanguage | null>(null)
  const [hasManualOverride, setHasManualOverride] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    setError(null)

    if (!selected) {
      setFile(null)
      return
    }

    const validationError = validateEpubFile(selected)
    if (validationError) {
      setError(validationError)
      setFile(null)
      return
    }

    setFile(selected)
    setLanguage(null)
    setHasManualOverride(false)
    setIsDetecting(true)
    try {
      const detected = await detectLanguage(selected)
      setLanguage(detected)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as SupportedLanguage)
    setHasManualOverride(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!file || !language) {
      setError('Please select an EPUB file')
      return
    }

    setIsSubmitting(true)
    try {
      await processEpub(file, language)
      setFile(null)
      setLanguage(null)
      setHasManualOverride(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const busy = isDetecting || isSubmitting

  const hintText = isDetecting
    ? 'Detecting language from file…'
    : file && language && !hasManualOverride
      ? `Detected: ${LANGUAGE_LABELS[language]}. You can change it manually.`
      : null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Upload EPUB File
          </h2>
          <p className="text-gray-600">
            Select an EPUB file to apply hyphenation.
          </p>
        </div>

        {error && <ErrorBanner error={error} />}

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="upload-form">
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
                disabled={busy}
              />
              <label
                htmlFor="file-input"
                className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  busy
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Click to select EPUB file'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 50MB</p>
                </div>
              </label>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Language
            </label>
            <div className="relative">
              <select
                id="language-select"
                value={language ?? '__detecting__'}
                onChange={handleLanguageChange}
                disabled={busy}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none"
              >
                {!hasManualOverride && (
                  <option value="__detecting__" disabled>
                    Auto-detecting…
                  </option>
                )}
                {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {isDetecting && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                </div>
              )}
            </div>
            {hintText && (
              <p className="text-xs text-gray-500 mt-1">{hintText}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={busy || !file || !language}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
