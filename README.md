# EPUB Hyphenator

A web application for applying language-specific hyphenation to EPUB files, improving typography and readability for digital publications. Upload EPUB files and choose between English or Russian hyphenation patterns for optimal text flow.

## Features

- **File Upload**: Drag-and-drop or click-to-select EPUB file upload with real-time validation
- **Language Support**: English and Russian hyphenation patterns
- **File Validation**: Automatic validation for file type (EPUB only) and size limits (up to 50MB)
- **Processing Pipeline**: Server-side hyphenation processing using the `epub-hyphen` CLI tool
- **Download Results**: Automatic download of processed EPUB files
- **Error Handling**: Comprehensive error messages and user feedback
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, TanStack Router
- **Backend**: TanStack Start with file-based API routes
- **Build Tool**: Vite with optimized configuration
- **Testing**: Vitest with React Testing Library
- **Development**: ESLint, Prettier, TypeScript strict mode
- **Processing**: External `epub-hyphen` CLI tool for hyphenation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- The `epub-hyphen` CLI tool installed globally (see Docker setup below for automatic installation)

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/razamanaza/epub-hyphenator.git
   cd epub-hyphenator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Upload an EPUB file and select your preferred language

## Running with Docker

This application includes a complete Docker setup for containerized deployment with the `epub-hyphen` CLI tool pre-installed.

### Prerequisites

- Docker and Docker Compose installed on your system

### Quick Start with Docker

1. **Clone the repository and navigate to the project directory**

2. **Start the application with Docker Compose:**

   ```bash
   docker compose up -d
   ```

3. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - The application will be running in a container with all dependencies properly configured

### Docker Commands

- **Start the application:**

  ```bash
  docker compose up -d
  ```

- **Stop the application:**

  ```bash
  docker compose down
  ```

- **View logs:**

  ```bash
  docker compose logs -f epub-hyphenator
  ```

- **Rebuild and restart:**
  ```bash
  docker compose down
  docker compose up -d --build
  ```

### Docker Configuration

The Docker setup includes:

- **Multi-stage build** for optimized image size
- **Global epub-hyphen installation** for EPUB processing
- **Non-root user** execution for security
- **Health checks** and proper port mapping
- **Production optimizations** with appropriate environment variables

The application runs identically in Docker as it does in a local development environment, with all EPUB processing functionality preserved.

## API Documentation

### Process EPUB Endpoint

The application provides a single API endpoint for EPUB processing:

**POST** `/api/process-epub`

#### Request

- **Content-Type**: `multipart/form-data`
- **Body Parameters**:
  - `file` (File): EPUB file to process (required)
  - `language` (String): Hyphenation language, either `"en"` for English or `"ru"` for Russian (required)

#### Response

**Success Response (200 OK)**:

```json
{
  "success": true,
  "fileName": "processed-file.epub",
  "file": "<base64-encoded-file-data>"
}
```

**Error Responses**:

- **400 Bad Request**: Invalid file type, size, or language parameter
- **500 Internal Server Error**: Processing failed or server error

#### Example Usage

```javascript
const formData = new FormData()
formData.append('file', epubFile)
formData.append('language', 'en')

const response = await fetch('/api/process-epub', {
  method: 'POST',
  body: formData,
})

if (response.ok) {
  const result = await response.json()
  // result.file contains the processed EPUB as base64
  // result.fileName contains the suggested download filename
}
```

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Check and fix formatting/linting
npm run check

# TypeScript type checking
npm run ts-check
```

### Testing

This project uses [Vitest](https://vitest.dev/) for testing with React Testing Library. Tests cover:

- Component rendering and user interactions
- Form validation logic
- Error handling scenarios
- API integration tests

Run tests with:

```bash
npm run test
```

### Code Quality

- **ESLint**: Configured with TanStack rules for consistent code style
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking enabled
- **Naming Conventions**: Follows global Cline rules (verbs for functions, nouns for values)

## Current Status

**Project Status**: MVP Complete (95% - Ready for Production)
**Last Updated**: December 23, 2025

### ✅ Completed Features

- **Frontend Implementation**: Complete upload form with drag-and-drop, validation, and responsive design
- **Backend Processing**: Full EPUB processing pipeline using `epub-hyphen` CLI tool
- **API Integration**: RESTful endpoint with proper error handling and file validation
- **Docker Deployment**: Containerized setup with CLI tool pre-installed
- **Testing Infrastructure**: Comprehensive unit tests for all components and API endpoints
- **Code Quality**: ESLint, Prettier, TypeScript strict mode, following global Cline engineering principles

### 🚧 Remaining Work (5%)

- **Performance Validation**: Large file handling and memory usage testing
- **Production Deployment**: Environment configuration and monitoring setup

## Deployment Considerations

### CLI Tool Dependency

The application requires the `epub-hyphen` CLI tool for EPUB processing. For production deployment:

1. **Docker Deployment**: Use the provided Docker setup (recommended)
2. **Manual Installation**: Install `epub-hyphen` globally on the server
3. **CI/CD**: Include CLI tool installation in deployment pipeline

## License

This project is part of the EPUB Hyphenator application, built with modern web technologies to improve digital typography.
