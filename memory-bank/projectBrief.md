# Project Brief: EPUB Hyphenator

## Overview

This project is a single-page web application that provides EPUB file hyphenation functionality. Users can upload EPUB files, select a language (English or Russian), and receive hyphenated versions of their documents.

## Core Requirements

- **Frontend**: Modern, responsive web interface with file upload and language selection
- **Backend**: Server-side processing using the `epub-hyphen` package
- **File Processing**: Add soft hyphens to EPUB content based on selected language
- **File Handling**: Download processed files with original filenames
- **Error Handling**: Display clear error messages when processing fails

## Technical Scope

- Language support: English and Russian (passed as `-l` parameter to epub-hyphen)
- File format: EPUB input/output only
- User experience: Simple, intuitive interface with progress feedback
- Error reporting: Detailed error context for troubleshooting

## Success Criteria

- Users can successfully upload and process EPUB files
- Hyphenation works correctly for supported languages
- File downloads work seamlessly
- Error messages provide actionable information
- Interface is responsive and accessible
