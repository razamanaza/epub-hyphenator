# Context7 Documentation Rule (Workspace)

## Purpose

**MANDATORY** use of Context7 documentation for all framework/library work. Prevents reliance on outdated training data.

---

## Trigger Conditions

BEFORE suggesting code using ANY of these libraries, MUST use Context7:

- React (hooks, patterns, APIs)
- TanStack Router
- TanStack Query
- tRPC
- Tailwind CSS
- React Router (any version)
- Any library you're not 100% certain about

---

## Workflow

### Step 1: Resolve Library ID

```javascript
use_mcp_tool({
  server_name: 'context7',
  tool_name: 'resolve-library-id',
  arguments: {
    libraryName: 'react',
  },
})
```

### Step 2: Get Documentation

```javascript
use_mcp_tool({
  server_name: 'context7',
  tool_name: 'get-library-docs',
  arguments: {
    context7CompatibleLibraryID: 'from_step_1',
    topic: 'useState hook patterns',
  },
})
```

### Step 3: Base Implementation on Docs

- Use patterns from Context7, NOT training data
- Document which Context7 sources were used
- If Context7 unavailable, state: "Working from training data - may not reflect latest patterns"

---

## Forbidden

- ❌ Implementing React hooks without checking Context7
- ❌ Using framework features from memory
- ❌ Assuming API patterns without verification
- ❌ Writing code based on training data alone

---

## Example: React useState Hook

### BEFORE Writing Code:

```javascript
// Use Context7 first
use_mcp_tool({
  server_name: 'context7',
  tool_name: 'resolve-library-id',
  arguments: { libraryName: 'react' },
})
// Then get docs for useState
use_mcp_tool({
  server_name: 'context7',
  tool_name: 'get-library-docs',
  arguments: {
    context7CompatibleLibraryID: '/reactjs/react.dev',
    topic: 'useState hook patterns',
  },
})
```

### AFTER Getting Context7 Data:

```tsx
// ✅ CORRECT - Based on Context7 docs
const [count, setCount] = useState<number>(0)

// ❌ WRONG - From training data (may be outdated)
const [count, setCount] = useState(0) // No explicit typing
```

---

## Verification

### For Framework Tasks

Before presenting code, I MUST:

- [ ] Used `resolve-library-id` for each unfamiliar library
- [ ] Used `get-library-docs` for relevant topics
- [ ] Based implementation on Context7, not training data
- [ ] Documented Context7 sources used

### Whitelist

These standard libraries don't require Context7:

- JavaScript built-ins (Array, Object, Promise, etc.)
- Standard DOM APIs
- TypeScript language features
- Node.js core modules

---

## Why This Matters

**Training data becomes outdated** - React patterns from 2019 may not be current best practices.

Context7 provides:

- Latest API documentation
- Current best practices
- Official patterns and examples
- Framework-specific guidance

**Without Context7**: Code may use deprecated patterns, incorrect APIs, or outdated conventions.

---

## Exception

If Context7 is unavailable:

1. State clearly: "Context7 unavailable - using training data"
2. Add TODO comment: "// TODO: Verify against official docs when Context7 available"
3. Flag for manual review

---

## Enforcement

This is a **MANDATORY** rule for all framework/library work.

Violation = Rule violation requiring immediate correction.
