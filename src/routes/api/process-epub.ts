import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { MAX_FILE_SIZE } from '@/shared/constants'
import { detectEpubLanguage } from '@/shared/epub-utils'

const execAsync = promisify(exec)

function isFile(value: unknown): value is File {
  return value instanceof File
}

function createTempFilePath(suffix: string = ''): string {
  return join('/tmp', `${randomBytes(16).toString('hex')}-${Date.now()}${suffix}.epub`)
}

async function cleanupTempFiles(filePaths: Array<string>): Promise<void> {
  await Promise.allSettled(
    filePaths.map(async (path) => {
      try {
        await fs.unlink(path)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.warn(`Failed to cleanup temp file ${path}:`, error)
        }
      }
    }),
  )
}

export const Route = createFileRoute('/api/process-epub')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData()
          const fileValue = formData.get('file')

          if (!isFile(fileValue)) {
            return json({ error: 'No file provided', success: false }, { status: 400 })
          }

          if (!fileValue.name.toLowerCase().endsWith('.epub')) {
            return json(
              { error: 'Invalid file type. Only EPUB files are allowed', success: false },
              { status: 400 },
            )
          }

          if (fileValue.size > MAX_FILE_SIZE) {
            return json(
              { error: 'File size must be less than 50MB', success: false },
              { status: 400 },
            )
          }

          const inputTempPath = createTempFilePath('-input')
          const outputTempPath = createTempFilePath('-output')

          const epubBuffer = Buffer.from(await fileValue.arrayBuffer())
          await fs.writeFile(inputTempPath, epubBuffer)

          const detectedLanguage = detectEpubLanguage(epubBuffer)

          console.log('Original EPUB file:')
          console.log('- File name:', fileValue.name)
          console.log('- File size:', fileValue.size, 'bytes')
          console.log('- Detected language:', detectedLanguage)

          try {
            await execAsync(`epub-hyphen -l ${detectedLanguage} ${inputTempPath} -o ${outputTempPath}`)

            const processedFileBuffer = await fs.readFile(outputTempPath)

            console.log('Processed EPUB file:')
            console.log('- Original file name:', fileValue.name)
            console.log('- Processed file size:', processedFileBuffer.length, 'bytes')

            return new Response(new Uint8Array(processedFileBuffer), {
              headers: {
                'Content-Disposition': `attachment; filename="${fileValue.name.replace('.epub', '')}-hyphenated.epub"`,
                'Content-Type': 'application/epub+zip',
                'Content-Length': processedFileBuffer.length.toString(),
              },
            })
          } catch (error) {
            console.error('EPUB hyphenation error:', error)
            return json(
              {
                error: error instanceof Error ? `EPUB hyphenation failed: ${error.message}` : 'EPUB hyphenation failed with unknown error',
                success: false,
              },
              { status: 500 },
            )
          } finally {
            await cleanupTempFiles([inputTempPath, outputTempPath])
          }
        } catch (error) {
          return json(
            {
              error: error instanceof Error ? error.message : 'An unexpected error occurred',
              success: false,
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
