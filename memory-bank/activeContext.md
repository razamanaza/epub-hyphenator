# Active Context

## Current Work Focus

The project is in its initial setup phase. We have a fresh TanStack Start application with all the necessary dependencies installed, but no actual EPUB hyphenation functionality has been implemented yet. The application currently shows the default TanStack Start landing page with demo content.

## Current State

### What's Working

- ✅ TanStack Start development environment fully configured
- ✅ All dependencies installed (React 19, TypeScript, TanStack Router, tRPC, etc.)
- ✅ Development server runs successfully (`npm run dev`)
- ✅ Build process configured and working
- ✅ Linting and formatting tools set up
- ✅ File-based routing structure in place

### What's Not Working / Missing

- ❌ No EPUB upload form implemented
- ❌ No language selection UI
- ❌ No server-side EPUB processing
- ❌ No epub-hyphen integration
- ❌ No file download functionality
- ❌ No error handling UI

## Recent Changes

### Project Initialization

- Created new TanStack Start project with TypeScript
- Installed all required dependencies
- Set up development environment
- Configured ESLint, Prettier, and Vitest

### Current Architecture

- Using TanStack Start for full-stack development
- File-based routing with TanStack Router
- tRPC for type-safe API communication
- Tailwind CSS for styling
- Ready for epub-hyphen command-line tool integration

## Next Steps (Immediate Priorities)

### Phase 1: Core UI Implementation

1. **Replace landing page** with EPUB upload form
2. **Create file input component** that accepts only .epub files
3. **Add language selector** (English/Russian dropdown)
4. **Implement form validation** and user feedback

### Phase 2: Backend Processing

1. **Create server function** for EPUB processing
2. **Integrate epub-hyphen command** execution
3. **Implement file upload handling** with temporary storage
4. **Add language parameter passing** to epub-hyphen

### Phase 3: File Handling & Download

1. **Implement file download** with original filename preservation
2. **Add processing status indicators** (loading states)
3. **Handle large file streaming** efficiently

### Phase 4: Error Handling & Polish

1. **Create error banner component** for user feedback
2. **Add comprehensive error handling** for all failure scenarios
3. **Implement proper cleanup** of temporary files
4. **Add input validation** and security measures

## Active Decisions & Considerations

### Technical Decisions Made

- **Framework Choice**: TanStack Start for unified full-stack experience
- **Language Support**: English and Russian (matching epub-hyphen capabilities)
- **File Format**: EPUB only (specific requirement, no need for other formats)
- **UI Framework**: Tailwind CSS for rapid development and responsive design

### Open Questions

- **File size limits**: What maximum EPUB file size should we support?
- **Processing timeouts**: How long should we wait for epub-hyphen processing?
- **Error message granularity**: How detailed should error messages be for users?
- **Server deployment**: Where and how will this be deployed?

### Important Patterns & Preferences

- **Type Safety First**: All code must be strictly typed with TypeScript
- **Component Composition**: Break UI into small, reusable components
- **Server Function Pattern**: Use TanStack Start server functions for backend logic
- **Error Boundaries**: Implement proper error boundaries and fallbacks
- **User Experience**: Prioritize clear feedback and loading states

## Learnings & Project Insights

### TanStack Start Experience

- Excellent developer experience with hot reload and type safety
- Server functions eliminate API boilerplate while maintaining type safety
- File-based routing is intuitive and reduces configuration

### EPUB Processing Considerations

- epub-hyphen is a command-line tool, requiring server-side execution
- Need careful handling of file I/O and temporary file management
- Language parameter must be properly sanitized to prevent command injection

### Development Workflow

- Vite provides fast development iteration
- ESLint catches issues early with TanStack's strict rules
- Testing setup with Vitest is ready but needs implementation
