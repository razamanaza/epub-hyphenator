# Implementation Plan

[Overview]
Replace console.log statements in src/routes/api/process-epub.ts with actual EPUB hyphenation processing using the epub-hyphen CLI tool.

This implementation will transform the current placeholder API endpoint into a fully functional EPUB processing pipeline that accepts uploaded EPUB files, applies language-specific hyphenation using the epub-hyphen tool, and returns processed files for download. The solution addresses the core functionality gap in the current codebase while maintaining existing validation patterns and error handling strategies.

[Types]
Single sentence describing the type system changes.

No new types are required as the existing SupportedLanguage type ('en' | 'ru') is compatible with epub-hyphen's language code requirements.

[Files]
Single sentence describing file modifications.

The implementation will modify only the existing src/routes/api/process-epub.ts file, adding file system operations and command execution logic.

Detailed breakdown:

- **Modified file**: src/routes/api/process-epub.ts
  - Add imports for Node.js modules: fs, path, crypto, child_process
  - Replace console.log statements (lines 73-77) with actual processing logic
  - Add temporary file creation and cleanup logic
  - Add epub-hyphen command execution with error handling
  - Modify response to return processed file for download

[Functions]
Single sentence describing function modifications.

The implementation will add new utility functions for file operations and command execution while preserving existing validation functions.

Detailed breakdown:

- **New functions**:
  - `createTempFilePath()`: Generates unique temporary file paths using timestamp and random string
  - `writeFileToTemp()`: Writes uploaded File content to temporary filesystem location
  - `executeEpubHyphen()`: Executes epub-hyphen command with proper error handling
  - `readProcessedFile()`: Reads processed file content for response
- **Modified functions**: None (existing validation functions remain unchanged)
- **Removed functions**: None

[Classes]
Single sentence describing class modifications.

No class modifications are required as this implementation uses functional programming patterns.

Detailed breakdown:

- **New classes**: None
- **Modified classes**: None
- **Removed classes**: None

[Dependencies]
Single sentence describing dependency modifications.

No new npm dependencies are required as the implementation uses built-in Node.js modules.

Detailed breakdown:

- **New packages**: None (using fs, path, crypto, child_process from Node.js core)
- **Version changes**: None
- **Integration requirements**: epub-hyphen CLI tool must be available in system PATH

[Testing]
Single sentence describing testing approach.

Manual testing will be performed to verify file processing and error handling scenarios.

Detailed breakdown:

- **Test scenarios**:
  - Successful processing with valid EPUB files (en and ru languages)
  - Error handling for invalid language codes
  - Error handling for epub-hyphen command failures
  - File size validation and error responses
  - Temporary file creation and persistence verification
- **Existing test modifications**: None (no existing tests for this endpoint)
- **Validation strategies**: Manual verification of processed file content and structure

[Implementation Order]
Single sentence describing the implementation sequence.

The implementation will follow a logical sequence to ensure proper integration and error handling.

Numbered steps showing the logical order of changes:

1. Add required Node.js module imports to the file
2. Implement temporary file creation utility functions
3. Implement file writing and reading functions
4. Implement epub-hyphen command execution with error handling
5. Replace console.log statements with processing pipeline
6. Modify API response to return processed file
7. Test with sample EPUB files for both languages
8. Verify error handling for various failure scenarios
