# Implementation Plan

## [Overview]

Single sentence describing the overall goal.
This plan implements automatic EPUB file download functionality after successful processing, with proper error handling and enhanced user feedback.

Multiple paragraphs outlining the scope, context, and high-level approach.
The current implementation has a mismatch between frontend and backend response handling. The backend correctly processes EPUB files and returns them as binary data with proper headers, but the frontend expects JSON responses and fails to handle the binary data. This implementation will modify the frontend to properly handle binary responses, trigger automatic file downloads, and provide appropriate user feedback. The backend will be enhanced to add a "-hyphenated" suffix to processed filenames. The solution maintains all existing validation, error handling, and processing logic while adding the missing download functionality.

## [Types]

Single sentence describing the type system changes.
No new types are required, but existing types will be used in modified functions.

Detailed type definitions, interfaces, enums, or data structures with complete specifications.

- `UploadFormData`: Existing interface for form data (file + language)
- `FormValidationError`: Existing union type for validation errors
- `SupportedLanguage`: Existing type for language validation ('en' | 'ru')
- `File`: Standard browser File type
- `Blob`: Standard browser Blob type for file downloads

## [Files]

Single sentence describing file modifications.
Two files will be modified to implement the download functionality.

Detailed breakdown:

- **Modified Files**:
  - `src/components/UploadForm.tsx`: Update submitForm function to handle binary responses and trigger downloads
  - `src/routes/api/process-epub.ts`: Add "-hyphenated" suffix to downloaded filename

- **No New Files**: All changes are modifications to existing files
- **No Deleted Files**: All existing files remain in place

## [Functions]

Single sentence describing function modifications.
The submitForm function will be significantly modified, and the backend response will be enhanced.

Detailed breakdown:

- **Modified Functions**:
  - `submitForm(uploadRequest: UploadFormData): Promise<void>` in `src/components/UploadForm.tsx`
    - Change: Replace JSON parsing with binary response handling
    - Add: File download logic using Blob and URL.createObjectURL
    - Add: Success feedback with form clearing
    - Add: Response type detection (binary vs JSON)

- **Backend Enhancement**:
  - Modify `Content-Disposition` header in `src/routes/api/process-epub.ts`
    - Change: Add "-hyphenated" suffix to filename in response headers

## [Classes]

Single sentence describing class modifications.
No class modifications are required for this implementation.

Detailed breakdown:

- No new classes needed
- No existing classes modified
- All changes are to standalone functions and response handling

## [Dependencies]

Single sentence describing dependency modifications.
No new dependencies are required for this implementation.

Details of new packages, version changes, and integration requirements.

- No new npm packages needed
- No version changes required
- Uses existing browser APIs: Blob, URL.createObjectURL, fetch
- Maintains compatibility with existing TanStack framework

## [Testing]

Single sentence describing testing approach.
Manual testing will verify the download functionality and error handling.

Test file requirements, existing test modifications, and validation strategies.

- **Manual Testing**:
  - Upload valid EPUB file and verify automatic download
  - Verify "-hyphenated" suffix in downloaded filename
  - Test error scenarios (invalid file type, size, language)
  - Verify success message and form clearing
  - Test network error handling

- **Existing Tests**:
  - No changes to existing unit tests
  - Component tests remain valid
  - Form validation tests unchanged

## [Implementation Order]

Single sentence describing the implementation sequence.
Changes should be implemented in backend-first order to ensure compatibility.

Numbered steps showing the logical order of changes to minimize conflicts and ensure successful integration:

1. **Backend Enhancement**: Modify filename in `src/routes/api/process-epub.ts`
2. **Frontend Update**: Modify `submitForm` function in `src/components/UploadForm.tsx`
3. **Testing**: Manual verification of download functionality
4. **Validation**: Test error scenarios and edge cases
5. **Documentation**: Update memory bank with implementation details

This order ensures the backend is ready to serve files with the correct filename before the frontend attempts to download them.
