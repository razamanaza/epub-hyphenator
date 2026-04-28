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
      screen.getByText(/Language is detected automatically/),
    ).toBeInTheDocument()
  })

  it('renders file input with correct attributes', () => {
    render(<UploadForm />)

    const fileInput = screen.getByLabelText(/EPUB File/)
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.epub')
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
  }, 10000)

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
