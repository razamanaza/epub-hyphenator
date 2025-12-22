import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

// Domain types
type SupportedLanguage = 'en' | 'ru'

// Type guard for File validation
function isFile(value: unknown): value is File {
  return value instanceof File
}

// Type guard for SupportedLanguage validation
function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === 'en' || value === 'ru'
}

export const Route = createFileRoute('/api/process-epub')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()

          // Get file with proper type safety
          const fileValue = formData.get('file')
          const languageValue = formData.get('language')

          // Validate file exists and is of correct type
          if (!isFile(fileValue)) {
            return json(
              {
                error: 'No file provided',
                success: false,
              },
              { status: 400 },
            )
          }

          // Validate file type
          if (!fileValue.name.toLowerCase().endsWith('.epub')) {
            return json(
              {
                error: 'Invalid file type. Only EPUB files are allowed',
                success: false,
              },
              { status: 400 },
            )
          }

          // Validate file size (50MB limit)
          const MAX_FILE_SIZE = 50 * 1024 * 1024
          if (fileValue.size > MAX_FILE_SIZE) {
            return json(
              {
                error: 'File size must be less than 50MB',
                success: false,
              },
              { status: 400 },
            )
          }

          // Validate language exists and is supported
          if (!isSupportedLanguage(languageValue)) {
            return json(
              {
                error: 'Invalid language. Must be "en" or "ru"',
                success: false,
              },
              { status: 400 },
            )
          }

          // Log file information and language code
          console.log('Processing EPUB file:')
          console.log('- File name:', fileValue.name)
          console.log('- File size:', fileValue.size, 'bytes')
          console.log('- Language:', languageValue)

          // Return success message for now
          return json({
            message: 'Not implemented yet',
            success: true,
          })
        } catch (error) {
          return json(
            {
              error:
                error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred',
              success: false,
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
