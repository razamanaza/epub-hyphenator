# EPUB Hyphenator - System Patterns

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   CLI Tool      │
│   (React)       │    │   (TanStack)    │    │   (epub-hyphen) │
│                 │    │                 │    │                 │
│ • UploadForm    │◄──►│ • File Handler  │◄──►│ • EPUB Parser   │
│ • Validation    │    │ • Validation    │    │ • Hyphenator    │
│ • UI Feedback   │    │ • CLI Integration│    │ • File Builder  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Current State (MVP Phase)

- **Frontend Complete**: React-based upload interface with validation and API integration
- **Backend Complete**: API endpoint with CLI tool integration and file processing
- **Processing Pipeline**: Complete file upload, processing, and download functionality

## Key Technical Decisions

### 1. Framework Choice: TanStack Start

**Decision**: Use TanStack Start (React + SSR + File-based routing)

**Rationale**:

- Modern React 19 with server-side rendering capabilities
- Built-in file-based routing reduces boilerplate
- Integrated TanStack Query for data fetching
- Excellent TypeScript support
- Aligns with global Cline preferences for modern frameworks

**Benefits**:

- SEO-friendly with SSR
- Type-safe routing
- Built-in development tools
- Excellent performance

### 2. State Management: React Hooks + TanStack Query

**Decision**: Use local React hooks for form state, TanStack Query for server state

**Rationale**:

- Simple form state doesn't require complex state management
- TanStack Query provides excellent server state handling
- Follows global engineering principle of "start simple, stay simple"
- Type-safe and well-tested

**Implementation Pattern**:

```typescript
// Local form state
const [formData, setFormData] = useState<UploadFormData>({
  file: null,
  language: 'en',
})

// Server state (future implementation)
const { mutate: processFile, isPending } = useMutation({
  mutationFn: submitForm,
  onSuccess: handleSuccess,
  onError: handleError,
})
```

### 3. Component Architecture: Functional Components

**Decision**: Use functional React components with hooks

**Rationale**:

- Aligns with modern React patterns
- Better TypeScript inference
- Simpler testing with Vitest
- Follows global preference for functional over class-based components

**Component Structure**:

```typescript
// Domain-specific component
export default function UploadForm() {
  // State and logic
  const [formData, setFormData] = useState<UploadFormData>({})

  // Event handlers
  const handleSubmit = async (event: React.FormEvent) => {
    // Implementation
  }

  // Render
  return (
    <div className="max-w-2xl mx-auto">
      {/* JSX */}
    </div>
  )
}
```

### 4. Type System: Explicit Domain Types

**Decision**: Define explicit domain types for all data structures

**Rationale**:

- Follows global TypeScript rules for explicit typing
- Prevents implicit any usage
- Improves code documentation and IDE support
- Enables compile-time error detection

**Type Patterns**:

```typescript
// Domain types
type Language = 'en' | 'ru'

interface UploadFormData {
  file: File | null
  language: Language
}

// Error types (union types for specific errors)
type FormValidationError =
  | 'no-file'
  | 'invalid-file-type'
  | 'file-too-large'
  | 'unknown-error'
```

### 5. Styling: Tailwind CSS with Utility Classes

**Decision**: Use Tailwind CSS for styling

**Rationale**:

- Consistent with TanStack Start setup
- Utility-first approach reduces custom CSS
- Excellent responsive design support
- Aligns with modern frontend practices

**Styling Patterns**:

```typescript
// Component styling
<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
  <div className="text-center mb-8">
    <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
  </div>
</div>

// Conditional styling
<button className={`p-4 border rounded-lg transition-colors ${
  isSelected
    ? 'border-blue-500 bg-blue-50 text-blue-700'
    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
}`}>
```

### 6. CLI Integration: External Tool Processing

**Decision**: Use `epub-hyphen` CLI tool for EPUB processing

**Rationale**:

- Faster development with proven tool
- Professional-grade hyphenation quality
- Reduced maintenance burden
- Focus on integration rather than algorithm development

**Implementation Pattern**:

```typescript
// CLI tool execution with error handling
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
```

## Component Relationships

### Current Component Structure

```
src/
├── components/
│   ├── UploadForm.tsx          # Main upload interface
│   ├── ErrorBanner.tsx         # Reusable error display
│   └── __tests__/
│       ├── UploadForm.test.tsx # Component tests
│       └── ErrorBanner.test.tsx
├── routes/
│   ├── __root.tsx              # Layout wrapper
│   └── index.tsx               # Home page (uses UploadForm)
├── routes/api/
│   └── process-epub.ts         # Backend API endpoint
```

### Data Flow Patterns

#### 1. Form Data Flow

```
User Input → UploadForm State → Validation → Submit → API Call → CLI Processing → Download
     ↓              ↓              ↓           ↓        ↓              ↓              ↓
  Event Handler   useState      validateFile   submitForm  Server    epub-hyphen  Response
```

#### 2. Error Handling Flow

```
Validation Error → Error State → ErrorBanner Display → User Action
       ↓                ↓              ↓                 ↓
   validateFile    setError         render         Correct Input

CLI Error → Error Response → ErrorBanner Display → User Action
     ↓              ↓              ↓                 ↓
epub-hyphen    JSON Error    setError         Retry/Contact Support
```

#### 3. File Processing Flow (Current)

```
File Upload → File Validation → API Endpoint → CLI Tool → File Download
     ↓              ↓              ↓          ↓              ↓
  UploadForm    validateFile   process-epub  epub-hyphen  Response
```

## Design Patterns in Use

### 1. Single Responsibility Principle

Each component has a single, well-defined purpose:

- `UploadForm`: Form handling and submission
- `ErrorBanner`: Error display and dismissal
- `validateEpubFile`: File validation logic
- `executeEpubHyphen`: CLI tool execution
- `cleanupTempFiles`: Temporary file management

### 2. Dependency Inversion

Components depend on abstractions, not concretions:

- Form validation is extracted to separate function
- Error handling is abstracted through `ErrorBanner` component
- CLI tool execution is abstracted through utility functions
- File management is abstracted through utility functions

### 3. Fail-Fast Validation

Input validation happens immediately, preventing invalid states:

- File type checked on selection
- File size validated before upload
- Form completeness checked before submission
- CLI tool errors caught and handled gracefully

### 4. Progressive Enhancement

Form works without JavaScript (future enhancement consideration):

- Semantic HTML structure
- Form validation on both client and server (planned)
- Accessible markup patterns

### 5. CLI Integration Pattern

External tool integration with proper error handling:

- Utility functions for CLI execution
- Temporary file management
- Buffer-based file processing
- Comprehensive error handling

## Testing Patterns

### 1. Component Testing with Vitest

- Test user interactions and state changes
- Test validation logic
- Test error conditions
- Mock external dependencies
- Test CLI integration (future)

### 2. Test Organization

```
src/components/__tests__/
├── UploadForm.test.tsx     # Component behavior tests
└── ErrorBanner.test.tsx    # Error display tests

src/routes/api/__tests__/   # API endpoint tests (future)
└── process-epub.test.ts    # Backend logic tests (future)
```

### 3. Testing Patterns

```typescript
// Component interaction testing
test('updates file selection when file is chosen', async () => {
  const file = new File(['test'], 'test.epub', { type: 'application/epub' })

  render(<UploadForm />)

  const fileInput = screen.getByLabelText(/EPUB File/i)
  await userEvent.upload(fileInput, file)

  expect(screen.getByText('test.epub')).toBeInTheDocument()
})

// CLI integration testing (future)
test('handles CLI tool errors gracefully', async () => {
  // Mock CLI tool failure
  // Test error handling and user feedback
})
```

## Current Implementation Patterns

### 1. TanStack Start API Routes

- **File-based Routing**: API routes defined in `src/routes/api/` directory
- **createFileRoute Pattern**: Route definition with server handlers
- **FormData Handling**: Built-in multipart form data parsing
- **File Download**: Direct file response with proper headers

```typescript
// API Route Pattern
export const Route = createFileRoute('/api/process-epub')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData()
        // Validation and processing logic
        return new Response(processedFileBuffer, {
          headers: {
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Type': 'application/epub+zip',
          },
        })
      },
    },
  },
})
```

### 2. Input Validation Pattern

- **File Type Validation**: Extension checking for EPUB files
- **Size Validation**: 50MB file size limits
- **Language Validation**: Enum validation for 'en' | 'ru'
- **Error Responses**: Consistent error format with status codes

```typescript
// Validation Pattern
if (!file.name.toLowerCase().endsWith('.epub')) {
  return json(
    {
      error: 'Invalid file type. Only EPUB files are allowed',
      success: false,
    },
    { status: 400 },
  )
}
```

### 3. Frontend-Backend Integration

- **Fetch API**: Direct HTTP requests to API endpoints
- **FormData Construction**: Client-side form data creation
- **Response Handling**: File download response handling
- **Type Safety**: Explicit response type handling

```typescript
// Frontend Integration Pattern
const formData = new FormData()
formData.append('file', uploadRequest.file)
formData.append('language', uploadRequest.language)

const response = await fetch('/api/process-epub', {
  method: 'POST',
  body: formData,
})

// Handle file download response
if (response.ok) {
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
}
```

### 4. CLI Integration Pattern

- **CLI Tool Execution**: External process execution with error handling
- **Temporary File Management**: Secure file creation and cleanup
- **Buffer Processing**: Memory-efficient file handling
- **Error Handling**: Comprehensive CLI error management

```typescript
// CLI Integration Pattern
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
```

### 5. File Management Pattern

- **Temporary File Creation**: Secure temp file paths
- **Automatic Cleanup**: Error-proof file removal
- **Buffer Handling**: Memory-efficient file operations
- **Resource Management**: Proper file handle cleanup

```typescript
// File Management Pattern
function createTempFilePath(suffix: string = ''): string {
  const timestamp = Date.now()
  const randomString = randomBytes(16).toString('hex')
  return join('/tmp', `${randomString}-${timestamp}${suffix}.epub`)
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
```

## Future Architecture Considerations

### 1. API Layer (tRPC)

- Type-safe API calls
- Automatic client generation
- Built-in error handling
- Middleware support for logging/auth

### 2. File Processing Pipeline

- EPUB parsing with dedicated library (alternative to CLI tool)
- Text extraction and hyphenation (alternative implementation)
- File reconstruction with proper structure
- Temporary file management improvements

### 3. Performance Optimizations

- File streaming for large uploads
- Background processing with job queue
- Caching of hyphenation patterns
- Compression for processed files
- Memory usage optimization

### 4. Error Recovery

- Retry mechanisms for failed processing
- Partial processing for corrupted files
- User notification system for long-running jobs
- Enhanced CLI tool error handling

### 5. Deployment Considerations

- CLI tool dependency management
- Production environment configuration
- Security hardening for file uploads
- Monitoring and error tracking setup

This system architecture provides a solid foundation for the MVP while allowing for future expansion and optimization.
