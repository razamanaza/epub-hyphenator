# EPUB Hyphenator - Technical Context

## Technology Stack

### Core Framework

#### TanStack Start

- **Version**: Latest (1.132.0 as of current implementation)
- **Components**:
  - React 19.2.0 (latest)
  - TanStack Router 1.132.0 (file-based routing)
  - TanStack Query 5.66.5 (server state management)
  - TanStack Start 1.132.0 (SSR framework)
- **Why Chosen**: Modern React ecosystem with excellent TypeScript support and built-in tooling

#### Development Environment

- **Build Tool**: Vite 7.1.7
- **TypeScript**: 5.7.2 with strict configuration
- **Package Manager**: npm (as evidenced by package-lock.json)
- **Node.js**: Required for development (version inferred from dependencies)

### Frontend Technologies

#### UI Framework

- **React**: 19.2.0 (functional components with hooks)
- **Styling**: Tailwind CSS 4.0.6 with Vite integration
- **Icons**: Lucide React 0.544.0
- **Development Tools**:
  - TanStack React Devtools 0.7.0
  - TanStack Router Devtools 1.132.0
  - TanStack Query Devtools 5.84.2

#### State Management

- **Local State**: React hooks (useState, useEffect)
- **Server State**: TanStack Query (planned for API integration)
- **Form State**: Controlled components with explicit state management

#### Backend Framework (Implemented)

- **API Layer**: TanStack Start API routes (file-based routing) ✅
- **Server Runtime**: Nitro (comes with TanStack Start) ✅
- **File Processing**: Node.js child process execution ✅
- **File Management**: Node.js filesystem operations ✅
- **Serialization**: SuperJSON 2.2.2 (available for future tRPC)
- **Status**: Fully implemented and tested ✅

### Development Tooling

#### Code Quality

- **Linting**: ESLint with TanStack config (@tanstack/eslint-config 0.3.0)
- **Formatting**: Prettier 3.5.3 with custom configuration
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Not configured (opportunity for improvement)

#### External Dependencies

- **CLI Tool**: `epub-hyphen` command-line utility
- **Node.js APIs**: `child_process`, `fs`, `path`, `crypto`
- **File Processing**: Buffer-based file handling
- **Error Handling**: Comprehensive CLI error management

#### Testing

- **Framework**: Vitest 3.0.5
- **Utilities**:
  - @testing-library/react 16.2.0
  - @testing-library/dom 10.4.0
  - @testing-library/jest-dom 6.9.1
  - jsdom 27.0.0 (DOM environment)
- **Test Setup**: Configured in src/test/setup.ts
- **Coverage**: Frontend components tested, backend integration validated ✅
- **Status**: Comprehensive unit testing complete ✅

#### Build and Deployment

- **Bundler**: Vite with plugin-react 5.0.4
- **TypeScript Paths**: vite-tsconfig-paths 5.1.4
- **Preview**: Vite preview server for production testing
- **Build Output**: Standard web assets (HTML, CSS, JS)
- **Deployment Requirements**: `epub-hyphen` CLI tool installation

## Development Setup

### Project Structure

```
epub-hyphenator/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── __tests__/        # Component tests
│   │   ├── ErrorBanner.tsx   # Error display component
│   │   └── UploadForm.tsx    # Main upload interface
│   ├── integrations/         # Framework integrations
│   │   ├── tanstack-query/   # Query configuration
│   │   └── trpc/             # tRPC setup (placeholder)
│   ├── routes/               # File-based routing
│   │   ├── __root.tsx        # Layout component
│   │   ├── index.tsx         # Home page
│   │   └── api/              # API routes (future)
│   ├── server/               # Server-side code
│   ├── data/                 # Static data/mocks
│   ├── test/                 # Test configuration
│   ├── styles.css            # Global styles
│   ├── router.tsx            # Router configuration
│   └── routeTree.gen.ts      # Generated route definitions
├── server/                   # Server implementation (separate)
├── memory-bank/              # Project documentation
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Test configuration
├── eslint.config.js          # Linting configuration
├── prettier.config.js        # Formatting configuration
└── README.md                 # Project documentation
```

### Development Scripts

```json
{
  "dev": "vite dev --port 3000",        # Development server
  "build": "vite build",                 # Production build
  "preview": "vite preview",             # Preview production build
  "test": "vitest run",                  # Run all tests
  "lint": "eslint",                      # Run linter
  "format": "prettier",                  # Format code
  "check": "prettier --write . && eslint --fix"  # Full code quality check
}
```

### Configuration Files

#### TypeScript (tsconfig.json)

- Strict type checking enabled
- Path aliases configured (via vite-tsconfig-paths)
- Modern ES target with lib support
- JSX transform configured for React

#### Vite (vite.config.ts)

- React plugin configured
- TanStack Router plugin for file-based routing
- Path aliases for clean imports
- Dev server on port 3000

#### ESLint (eslint.config.js)

- TanStack ESLint configuration
- React and TypeScript rules
- Import/export validation

#### Prettier (prettier.config.js)

- Custom formatting rules
- Consistent with TanStack defaults
- Semi-colon and quote style enforcement

## Technical Constraints and Requirements

### Browser Support

- **Modern Browsers**: ES2020+ support required
- **File API**: Required for EPUB file handling
- **Blob API**: Required for file download functionality
- **Fetch API**: Required for API communication

### Performance Requirements

- **File Size Limit**: 50MB maximum upload size
- **Memory Usage**: Efficient handling of large files
- **Response Time**: <3 seconds for typical processing
- **Bundle Size**: Optimized for fast initial load

### Security Considerations

- **File Upload**: Type and size validation
- **Content Security**: CSP headers in production
- **API Security**: Rate limiting and input validation
- **File Storage**: Temporary file handling with cleanup

### Accessibility Requirements

- **WCAG 2.1**: AA compliance minimum
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meeting contrast ratio requirements

## Development Patterns and Standards

### Code Organization Standards

- **Component First**: Feature-based component organization
- **Explicit Typing**: All functions and variables explicitly typed
- **Single Responsibility**: Each component/function has one purpose
- **Test Coverage**: Core logic must have unit tests

### Naming Conventions (Following Global Rules)

- **Components**: PascalCase (UploadForm, ErrorBanner)
- **Functions**: camelCase with verbs (handleSubmit, validateFile)
- **Variables**: camelCase with descriptive nouns (formData, isSubmitting)
- **Types**: PascalCase for interfaces/types (UploadFormData, Language)
- **Constants**: UPPER_SNAKE_CASE (MAX_FILE_SIZE)

### Import Patterns

- **Framework Imports**: Grouped at top
- **Component Imports**: Local components next
- **Utility Imports**: Third-party utilities last
- **Type Imports**: Use `import type` when possible

### Error Handling Patterns

- **Validation Errors**: Specific error types with actionable messages
- **API Errors**: Graceful degradation with user feedback
- **Network Errors**: Retry mechanisms where appropriate
- **Unexpected Errors**: Generic fallback with logging

## Dependencies Analysis

### Production Dependencies

```typescript
// Core framework
"@tanstack/react-start": "^1.132.0"     // Main framework
"react": "^19.2.0"                       // UI library
"react-dom": "^19.2.0"                   // DOM renderer

// State management and routing
"@tanstack/react-router": "^1.132.0"    // Type-safe routing
"@tanstack/react-query": "^5.66.5"      // Server state
"@tanstack/router-ssr-query": "^1.131.7" // SSR integration

// Backend (planned)
"@trpc/client": "^11.4.3"               // API client
"@trpc/server": "^11.4.3"               // API server
"@trpc/tanstack-react-query": "^11.4.3"  // tRPC + React Query

// UI and styling
"@tailwindcss/vite": "^4.0.6"            // Tailwind Vite plugin
"tailwindcss": "^4.0.6"                  // CSS framework
"lucide-react": "^0.544.0"              // Icon library

// Utilities
"superjson": "^2.2.2"                    // Serialization for tRPC
"zod": "^4.1.11"                         // Schema validation
```

### Development Dependencies

```typescript
// Build tools
"vite": "^7.1.7"                         // Build tool
"@vitejs/plugin-react": "^5.0.4"         // React plugin
"vite-tsconfig-paths": "^5.1.4"         // Path aliases

// Code quality
"@tanstack/eslint-config": "^0.3.0"      // ESLint config
"prettier": "^3.5.3"                     // Code formatter

// Testing
"vitest": "^3.0.5"                       // Test runner
"@testing-library/react": "^16.2.0"      // React testing
"@testing-library/dom": "^10.4.0"        // DOM testing
"@testing-library/jest-dom": "^6.9.1"   // Test utilities
"jsdom": "^27.0.0"                       // DOM environment

// Type definitions
"@types/react": "^19.2.0"                // React types
"@types/react-dom": "^19.2.0"            // React DOM types
"@types/node": "^22.10.2"                // Node.js types
"typescript": "^5.7.2"                   // TypeScript compiler
```

## Environment Variables and Configuration

### Development Environment

- **Dev Server**: localhost:3000
- **Hot Reload**: Enabled by Vite
- **Source Maps**: Enabled for debugging
- **API Proxy**: Configured for development backend

### Production Considerations

- **Build Optimization**: Code splitting and minification
- **Asset Optimization**: Image and font optimization
- **Caching Headers**: Static asset caching strategy
- **Environment Variables**: Production-specific configuration

## Technical Debt and Improvement Opportunities

### Immediate Improvements

1. **Git Hooks**: Pre-commit hooks for linting and testing
2. **Error Boundaries**: React error boundaries for better UX
3. **Loading States**: Skeleton screens during file processing
4. **Accessibility**: ARIA labels and keyboard navigation improvements

### Medium-term Enhancements

1. **Performance**: File streaming for large uploads
2. **Testing**: Integration tests for full user flows
3. **Monitoring**: Error tracking and performance monitoring
4. **Documentation**: API documentation and component storybook

### Long-term Considerations

1. **Monorepo**: Separate frontend and backend packages
2. **Microservices**: Specialized processing services
3. **CDN**: Content delivery network for static assets
4. **Caching**: Redis or similar for processed files

This technical context provides the foundation for understanding the current implementation and planning future technical decisions.
