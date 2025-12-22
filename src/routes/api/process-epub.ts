import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'

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

// Utility function to create unique temporary file path
function createTempFilePath(suffix: string = ''): string {
  const timestamp = Date.now()
  const randomString = randomBytes(16).toString('hex')
  const extension = '.epub'
  return join('/tmp', `${randomString}-${timestamp}${suffix}${extension}`)
}

// Utility function to cleanup temporary files
async function cleanupTempFiles(filePaths: Array<string>): Promise<void> {
  await Promise.allSettled(
    filePaths.map(async (path) => {
      try {
        await fs.unlink(path)
      } catch (error) {
        // Ignore errors if file doesn't exist
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.warn(`Failed to cleanup temp file ${path}:`, error)
        }
      }
    }),
  )
}

// Utility function to write file content to temporary location
async function writeFileToTemp(file: File, tempPath: string): Promise<void> {
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(tempPath, buffer)
}

// Utility function to execute epub-hyphen command
async function executeEpubHyphen(
  inputPath: string,
  outputPath: string,
  language: SupportedLanguage,
): Promise<void> {
  const execAsync = promisify(exec)
  const command = `epub-hyphen -l ${language} ${inputPath} -o ${outputPath}`

  try {
    await execAsync(command)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`EPUB hyphenation failed: ${error.message}`)
    }
    throw new Error('EPUB hyphenation failed with unknown error')
  }
}

// Utility function to read processed file content
async function readProcessedFile(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath)
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

          // Create temporary file paths
          const inputTempPath = createTempFilePath('-input')
          const outputTempPath = createTempFilePath('-output')
          const tempFiles = [inputTempPath, outputTempPath]

          // Write uploaded file to temporary location
          await writeFileToTemp(fileValue, inputTempPath)

          // Log original file information
          console.log('Original EPUB file:')
          console.log('- File name:', fileValue.name)
          console.log('- File size:', fileValue.size, 'bytes')

          try {
            // Execute epub-hyphen command
            await executeEpubHyphen(
              inputTempPath,
              outputTempPath,
              languageValue,
            )

            // Read processed file
            const processedFileBuffer = await readProcessedFile(outputTempPath)

            // Log processed file information
            console.log('Processed EPUB file:')
            console.log('- Original file name:', fileValue.name)
            console.log(
              '- Processed file size:',
              processedFileBuffer.length,
              'bytes',
            )

            // Return processed file for download
            return new Response(new Uint8Array(processedFileBuffer), {
              headers: {
                'Content-Disposition': `attachment; filename="${fileValue.name.replace('.epub', '')}-hyphenated.epub"`,
                'Content-Type': 'application/epub+zip',
                'Content-Length': processedFileBuffer.length.toString(),
              },
            })
          } catch (error) {
            // Handle epub-hyphen processing errors
            if (error instanceof Error) {
              return json(
                {
                  error: error.message,
                  success: false,
                },
                { status: 400 },
              )
            }
            return json(
              {
                error: 'An unexpected error occurred during EPUB processing',
                success: false,
              },
              { status: 500 },
            )
          } finally {
            // Cleanup temporary files regardless of success/failure
            await cleanupTempFiles(tempFiles)
          }
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
