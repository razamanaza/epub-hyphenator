import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ErrorBanner from '../ErrorBanner'

describe('ErrorBanner', () => {
  it('renders error message correctly', () => {
    const errorMessage = 'This is a test error message'
    render(<ErrorBanner error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('renders alert triangle icon', () => {
    const errorMessage = 'Error with icon'
    render(<ErrorBanner error={errorMessage} />)

    const alertIcon = document.querySelector('.lucide-triangle-alert')
    expect(alertIcon).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const errorMessage = 'Styled error'
    const { container } = render(<ErrorBanner error={errorMessage} />)

    const banner = container.firstChild as HTMLElement
    expect(banner).toHaveClass(
      'bg-red-50',
      'border-red-200',
      'rounded-lg',
      'p-4',
      'mb-4',
    )
  })

  it('displays different error messages', () => {
    const errorMessages = [
      'File not found',
      'Invalid file type',
      'File too large',
      'Network error',
    ]

    errorMessages.forEach((message) => {
      const { unmount } = render(<ErrorBanner error={message} />)
      expect(screen.getByText(message)).toBeInTheDocument()
      unmount()
    })
  })
})
