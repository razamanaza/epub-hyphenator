# Implementation Plan

## Overview

Replace the default TanStack Start landing page with a simple EPUB upload form that allows users to select an EPUB file and choose between English or Russian language for hyphenation processing.

## Types

Define the core data types for the upload form and processing parameters.

- `Language`: Union type for supported languages ('en' | 'ru')
- `UploadFormData`: Object with file (File) and language (Language) properties
- `FormValidationError`: String union for specific validation error messages

## Files

Modify the main index route to replace the landing page with the upload form component.

- **Modified**: `src/routes/index.tsx` - Replace default TanStack Start content with upload form UI
- **Created**: `src/components/UploadForm.tsx` - New component containing file input, language selector, and form validation
- **Created**: `src/components/ErrorBanner.tsx` - Reusable error display component

## Functions

Implement form handling and validation logic.

- **Created**: `validateEpubFile(file: File): string | null` - Validates file type and size
- **Created**: `handleFormSubmit(data: UploadFormData): Promise<void>` - Handles form submission (placeholder for future server integration)
- **Created**: `UploadForm` component function with controlled form state and validation

## Classes

No new classes required - using functional React components with hooks.

## Dependencies

No new dependencies required - using existing React, TanStack Router, and Lucide React.

## Testing

Create unit tests for form validation and component behavior.

- **Created**: `src/components/__tests__/UploadForm.test.tsx` - Tests for file validation, language selection, form submission
- **Created**: `src/components/__tests__/ErrorBanner.test.tsx` - Tests for error display functionality

## Implementation Order

1. Create ErrorBanner component
2. Create UploadForm component with validation
3. Update index route to use UploadForm
4. Add unit tests for components
5. Verify form works with mock submission
