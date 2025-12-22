# System Patterns & Architecture

## Application Architecture

### Full-Stack Pattern: TanStack Start

- **Single Framework**: TanStack Start provides both frontend and backend in one cohesive system
- **Server Functions**: Client can call server-side functions directly, eliminating separate API endpoints
- **Type Safety**: End-to-end TypeScript ensures frontend and backend stay in sync
- **File-based Routing**: Routes defined as files, automatically generating type-safe navigation

### Component Architecture

```
Frontend (SPA)
├── Upload Form Component
│   ├── File Input (EPUB only)
│   ├── Language Selector (English/Russian)
│   └── Submit Button
├── Processing Status Display
├── Error Banner Component
└── Download Handler
```

### Data Flow Pattern

```
1. User selects EPUB file + language
2. File uploaded to server function
3. Server validates file type
4. Server executes epub-hyphen command
5. Server returns processed file or error
6. Frontend triggers download or shows error
```

## Key Technical Decisions

### File Processing Strategy

- **Server-side execution**: epub-hyphen runs on server to avoid browser limitations
- **Temporary files**: Input files stored temporarily during processing
- **Direct streaming**: Processed files streamed directly to client for download
- **Cleanup**: Temporary files removed after processing

### Error Handling Patterns

- **Validation first**: File type and size validation before processing
- **Command execution**: Capture stderr/stdout from epub-hyphen for error reporting
- **User feedback**: Clear error messages with actionable context
- **Graceful degradation**: UI remains functional even when backend fails

### State Management

- **Local component state**: Form inputs and loading states managed locally
- **Server state**: TanStack Query handles server function calls and caching
- **Error state**: Global error state for banner display

## Security Considerations

### File Upload Security

- **Type validation**: Only .epub files accepted
- **Size limits**: Reasonable file size restrictions
- **Path safety**: Secure temporary file handling
- **No execution**: Uploaded files never executed, only processed

### Server Function Security

- **Input validation**: All inputs validated before processing
- **Command injection prevention**: Language parameter sanitized
- **Resource limits**: Processing timeouts and resource constraints

## Component Patterns

### Form Component Pattern

```typescript
// Controlled form with validation
const [file, setFile] = useState<File | null>(null)
const [language, setLanguage] = useState<'en' | 'ru'>('en')
const [isProcessing, setIsProcessing] = useState(false)
```

### Server Function Pattern

```typescript
// Type-safe server function
export const processEpub = createServerFn()
  .validator(
    z.object({ file: z.instanceof(File), language: z.enum(['en', 'ru']) }),
  )
  .handler(async ({ file, language }) => {
    // Process file and return result
  })
```

### Error Display Pattern

```typescript
// Consistent error UI
const [error, setError] = useState<string | null>(null)
// Show error banner when error exists
{error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
```

## File Handling Patterns

### Upload Processing

- Accept only .epub MIME type
- Validate file extension
- Check file size limits
- Generate unique temporary filenames

### Download Handling

- Set appropriate Content-Type headers
- Use original filename for download
- Handle large file streaming
- Clean up server resources

## Development Patterns

### Code Organization

- **Feature-based**: Components grouped by functionality
- **Type safety**: Strict TypeScript with no `any` usage
- **Consistent naming**: Clear, descriptive function and variable names
- **Single responsibility**: Each component/function has one clear purpose

### Testing Strategy

- **Unit tests**: Individual functions and components
- **Integration tests**: Server function interactions
- **E2E tests**: Complete user workflows (future)

### Build & Deployment

- **Development**: Hot reload with Vite dev server
- **Production**: Static generation where possible, server functions for dynamic content
- **CI/CD**: Automated testing and building on commits
