# EPUB Hyphenator - System Patterns

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Processing    │
│   (React)       │    │   (tRPC/Nitro)  │    │   Engine        │
│                 │    │                 │    │                 │
│ • UploadForm    │◄──►│ • File Handler  │◄──►│ • EPUB Parser   │
│ • Validation    │    │ • Validation    │    │ • Hyphenator    │
│ • UI Feedback   │    │ • Processing    │    │ • File Builder  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Current State (MVP Phase)

- **Frontend Complete**: React-based upload interface with validation
- **Backend Foundation**: API endpoint implemented with file handling
- **Processing Pipeline**: File validation and logging complete, hyphenation pending

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
```

### Data Flow Patterns

#### 1. Form Data Flow

```
User Input → UploadForm State → Validation → Submit → API Call
     ↓              ↓              ↓           ↓        ↓
  Event Handler   useState      validateFile   submitForm  Server
```

#### 2. Error Handling Flow

```
Validation Error → Error State → ErrorBanner Display → User Action
       ↓                ↓              ↓                 ↓
   validateFile    setError         render         Correct Input
```

#### 3. File Processing Flow (Future)

```
File Upload → File Validation → tRPC API → EPUB Processing → Download
     ↓              ↓              ↓          ↓              ↓
  UploadForm    validateFile   backend.ts  hyphenate()   FileResponse
```

## Design Patterns in Use

### 1. Single Responsibility Principle

Each component has a single, well-defined purpose:

- `UploadForm`: Form handling and submission
- `ErrorBanner`: Error display and dismissal
- `validateEpubFile`: File validation logic

### 2. Dependency Inversion

Components depend on abstractions, not concretions:

- Form validation is extracted to separate function
- Error handling is abstracted through `ErrorBanner` component
- Future API calls will be abstracted through tRPC

### 3. Fail-Fast Validation

Input validation happens immediately, preventing invalid states:

- File type checked on selection
- File size validated before upload
- Form completeness checked before submission

### 4. Progressive Enhancement

Form works without JavaScript (future enhancement consideration):

- Semantic HTML structure
- Form validation on both client and server (planned)
- Accessible markup patterns

## Testing Patterns

### 1. Component Testing with Vitest

- Test user interactions and state changes
- Test validation logic
- Test error conditions
- Mock external dependencies

### 2. Test Organization

```
src/components/__tests__/
├── UploadForm.test.tsx     # Component behavior tests
└── ErrorBanner.test.tsx    # Error display tests
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
```

## Current Implementation Patterns

### 1. TanStack Start API Routes

- **File-based Routing**: API routes defined in `src/routes/api/` directory
- **createFileRoute Pattern**: Route definition with server handlers
- **FormData Handling**: Built-in multipart form data parsing
- **JSON Responses**: Standardized response format with status codes

```typescript
// API Route Pattern
export const Route = createFileRoute('/api/process-epub')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData()
        // Validation and processing logic
        return json({ message: 'Not implemented yet', success: true })
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
- **Response Handling**: JSON response parsing and error handling
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

const result = await response.json()
```

## Future Architecture Considerations

### 1. API Layer (tRPC)

- Type-safe API calls
- Automatic client generation
- Built-in error handling
- Middleware support for logging/auth

### 2. File Processing Pipeline

- EPUB parsing with dedicated library
- Text extraction and hyphenation
- File reconstruction with proper structure
- Temporary file management

### 3. Performance Optimizations

- File streaming for large uploads
- Background processing with job queue
- Caching of hyphenation patterns
- Compression for processed files

### 4. Error Recovery

- Retry mechanisms for failed processing
- Partial processing for corrupted files
- User notification system for long-running jobs

This system architecture provides a solid foundation for the MVP while allowing for future expansion and optimization.
