import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UploadForm from '../UploadForm'
import '@testing-library/jest-dom'

describe('UploadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('renders upload form with title and description', () => {
    render(<UploadForm />)

    expect(screen.getByText('Upload EPUB File')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Select an EPUB file and choose your preferred language/,
      ),
    ).toBeInTheDocument()
  })

  it('renders file input with correct attributes', () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.epub')
  })

  it('renders language selection buttons', () => {
    render(<UploadForm />)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Russian')).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
    expect(screen.getByText('ru')).toBeInTheDocument()
  })

  it('defaults to English language selection', () => {
    render(<UploadForm />)

    const englishButton = screen.getByText('English').closest('button')
    const russianButton = screen.getByText('Russian').closest('button')

    expect(englishButton).toHaveClass(
      'border-blue-500',
      'bg-blue-50',
      'text-blue-700',
    )
    expect(russianButton).toHaveClass(
      'border-gray-300',
      'bg-white',
      'text-gray-700',
    )
  })

  it('allows language selection change', () => {
    render(<UploadForm />)

    const russianButton = screen.getByText('Russian').closest('button')
    fireEvent.click(russianButton!)

    expect(russianButton).toHaveClass(
      'border-blue-500',
      'bg-blue-50',
      'text-blue-700',
    )

    const englishButton = screen.getByText('English').closest('button')
    expect(englishButton).toHaveClass(
      'border-gray-300',
      'bg-white',
      'text-gray-700',
    )
  })

  it('shows file name when file is selected', async () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    const file = new File(['test content'], 'test.epub', {
      type: 'application/epub+zip',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('test.epub')).toBeInTheDocument()
    })
  })

  it('shows validation error for non-EPUB files', async () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    const submitButton = screen.getByRole('button', {
      name: /Upload & Process/,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Please select a valid EPUB file'),
      ).toBeInTheDocument()
    })
  })

  it('shows validation error for files over size limit', async () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    const largeFile = new File(['x'.repeat(51 * 1024 * 1024)], 'large.epub', {
      type: 'application/epub+zip',
    })

    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    const submitButton = screen.getByRole('button', {
      name: /Upload & Process/,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('File size must be less than 50MB'),
      ).toBeInTheDocument()
    })
  })

  it('disables submit button when no file is selected', () => {
    render(<UploadForm />)

    const submitButton = screen.getByRole('button', {
      name: /Upload & Process/,
    })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when file is selected', async () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    const file = new File(['test content'], 'test.epub', {
      type: 'application/epub+zip',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      const submitButton = screen.getByRole('button', {
        name: /Upload & Process/,
      })
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('disables form controls during submission', async () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    const file = new File(['test content'], 'test.epub', {
      type: 'application/epub+zip',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    const submitButton = screen.getByRole('button', {
      name: /Upload & Process/,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Processing...')
      expect(fileInput).toBeDisabled()
    })
  })

  it('shows error message when submission fails', async () => {
    // Mock the fetch call to simulate API failure
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' }),
      }),
    ) as any

    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    const file = new File(['test content'], 'test.epub', {
      type: 'application/epub+zip',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    const submitButton = screen.getByRole('button', {
      name: /Upload & Process/,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
  })

  it('validates file selection on submit', async () => {
    render(<UploadForm />)

    // Test validation by directly calling the form submission
    const form = screen.getByTestId('upload-form')
    fireEvent.submit(form)

    await waitFor(
      () => {
        expect(
          screen.getByText('Please select an EPUB file'),
        ).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })
})
