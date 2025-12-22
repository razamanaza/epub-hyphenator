# Technical Context

## Technology Stack

### Frontend Framework

- **React 19**: Latest React with modern hooks and concurrent features
- **TypeScript**: Type-safe development with strict typing
- **TanStack Router**: File-based routing with type-safe navigation
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### Backend & Full-Stack

- **TanStack Start**: Full-stack React framework with server functions
- **Nitro**: Server engine for TanStack Start (provides API routes, SSR)
- **tRPC**: Type-safe API layer between frontend and backend

### Development Tools

- **Vite**: Fast build tool and development server
- **Vitest**: Testing framework optimized for Vite
- **ESLint + Prettier**: Code linting and formatting
- **TypeScript**: Compiler and type checking

### External Dependencies

- **epub-hyphen**: Core hyphenation library (https://github.com/gromnitsky/epub-hyphen)
  - Command-line tool for adding soft hyphens to EPUB files
  - Supports multiple languages via `-l` parameter
  - Processes EPUB files directly

## Development Setup

### Environment

- **Node.js**: Required for running the development server and build process
- **npm**: Package management and script execution
- **Git**: Version control

### Key Scripts

```json
{
  "dev": "vite dev --port 3000",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "lint": "eslint",
  "format": "prettier",
  "check": "prettier --write . && eslint --fix"
}
```

### Project Structure

```
src/
├── routes/          # File-based routing (TanStack Router)
├── components/      # Reusable React components
├── integrations/    # External service integrations (tRPC, TanStack Query)
├── data/           # Static data and demo content
└── styles.css      # Global styles
```

## Runtime Dependencies

### Production Dependencies

- React ecosystem (Router, Query, Start)
- UI libraries (Lucide React for icons)
- Server utilities (tRPC, SuperJSON, Nitro)
- Styling (Tailwind CSS)

### Development Dependencies

- Type checking (TypeScript)
- Testing (Vitest, Testing Library)
- Linting/Formatting (ESLint, Prettier)
- Build tools (Vite, various plugins)

## epub-hyphen Integration

The core processing relies on the `epub-hyphen` command-line tool:

- Installed as a system dependency (not npm package)
- Executed server-side via TanStack Start server functions
- Language parameter passed as `-l` flag
- Input/output file handling managed by the application

## Deployment Considerations

- **Static hosting**: Frontend can be deployed to any static host
- **Server requirements**: Backend needs Node.js environment that can execute system commands
- **File processing**: Server must have epub-hyphen installed and accessible
- **Security**: File upload handling requires proper validation and temporary file management
