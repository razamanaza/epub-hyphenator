import { json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { MAX_FILE_SIZE } from '@/shared/constants'
import { detectEpubLanguage } from '@/shared/epub-utils'

function isFile(value: unknown): value is File {
  return value instanceof File
}

export const Route = createFileRoute('/api/detect-language')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData()
        const fileValue = formData.get('file')

        if (!isFile(fileValue)) {
          return json({ error: 'No file provided' }, { status: 400 })
        }

        if (!fileValue.name.toLowerCase().endsWith('.epub')) {
          return json({ error: 'Invalid file type' }, { status: 400 })
        }

        if (fileValue.size > MAX_FILE_SIZE) {
          return json({ error: 'File too large' }, { status: 400 })
        }

        const epubBuffer = Buffer.from(await fileValue.arrayBuffer())
        const language = detectEpubLanguage(epubBuffer)

        return json({ language })
      },
    },
  },
})
