import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/process-epub')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()

          const file = formData.get('file') as File
          const language = formData.get('language') as string

          // Validate file exists
          if (!file) {
            return json(
              {
                error: 'No file provided',
                success: false,
              },
              { status: 400 },
            )
          }

          // Validate file type
          if (!file.name.toLowerCase().endsWith('.epub')) {
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
          if (file.size > MAX_FILE_SIZE) {
            return json(
              {
                error: 'File size must be less than 50MB',
                success: false,
              },
              { status: 400 },
            )
          }

          // Validate language
          if (!['en', 'ru'].includes(language)) {
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
          console.log('- File name:', file.name)
          console.log('- File size:', file.size, 'bytes')
          console.log('- Language:', language)

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
