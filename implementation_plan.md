# Implementation Plan

## Overview

Create a TanStack Start API endpoint that accepts POST requests with multipart/form-data containing an EPUB file and language code, logs's information, and returns a placeholder response.

The implementation will leverage TanStack Start's built-in support for FormData processing and createFileRoute pattern for API endpoints. This follows the existing project architecture and integrates seamlessly with the current UploadForm component.

## Types

The endpoint will handle FormData with the following structure:

- `file`: File object (EPUB file) - Binary file data with name, size, and type properties
- `language`: string ('en' or 'ru') - Language code for hyphenation processing

TypeScript interfaces will be defined for type safety:

```typescript
interface ProcessEpubRequest {
  file: File
  language: 'en' | 'ru'
}

interface ProcessEpubResponse {
  message: string
  success: boolean
}
```

## Files

### New files to be created:

- `src/routes/api/process-epub.ts` - Main API endpoint handling FormData upload and validation

### Existing files to be modified:

- `src/components/UploadForm.tsx` - Update submitForm function to call new endpoint using FormData

### Files to be deleted:

- `server/` directory and all contents - Remove obsolete directory as specified

### Configuration file updates:

- No configuration files need modification

## Functions

### New functions:

- `processEpub` server function in `src/routes/api/process-epub.ts`
  - Signature: `createServerFn({ method: 'POST' }).inputValidator((data) => { ... }).handler(async ({ data }) => { ... })`
  - Purpose: Handle FormData upload, validate file type and language, console log file info and language code
  - Returns: JSON response with success message "Not implemented yet"

### Modified functions:

- `submitForm` in `src/components/UploadForm.tsx`
  - Current: Placeholder function that throws error about server integration
  - Required changes: Replace with FormData creation and fetch to new endpoint
  - Integration: Use existing file validation logic and language state

## Classes

No new classes required. Implementation follows existing TanStack Start patterns using:

- `createFileRoute` for route definition
- `createServerFn` for server function creation
- Existing React component patterns

## Dependencies

No new dependencies required. Using existing project dependencies:

- `@tanstack/react-start` (createServerFn, createFileRoute)
- `@tanstack/react-router` (route utilities)
- Built-in Node.js FormData API
- Built-in browser FormData and fetch APIs

## Testing

### Test file requirements:

- Endpoint testing with curl/postman for multipart upload
- File size validation testing (50MB limit already implemented)
- Language validation testing ('en'/'ru' already implemented)
- Console logging verification

### Existing test modifications:

- No existing tests require modification
- Current UploadForm tests will continue to work with updated implementation

### Validation strategies:

- FormData instance validation in inputValidator
- File type validation (.epub extension)
- Language code validation ('en' | 'ru')
- File size validation (50MB limit)

## Implementation Order

1. Create `src/routes/api/process-epub.ts` endpoint with FormData handling and validation
2. Update `src/components/UploadForm.tsx` submitForm function to call new endpoint using FormData
3. Test complete integration between frontend form and backend endpoint
4. Remove obsolete `server/` directory and contents
5. Verify all functionality works as expected
