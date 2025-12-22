# Naming Enforcement (Workspace) - Reinforces Global 00-core-engineering.md

## Purpose

**MANDATORY** enforcement of global naming rules with active verification and correction workflow.

---

## Forbidden Patterns (Zero Tolerance)

❌ These are **ILLEGAL** in ALL code:

```
Variables/Parameters: data, payload, result, response, value, info, temp
Functions: handleX, processY, doThing (any verb + X/Y/Thing)
```

✅ Correct alternatives:

| ❌ Forbidden   | ✅ Correct Alternative        | Context            |
| -------------- | ----------------------------- | ------------------ |
| `handleSubmit` | `submitForm`                  | Form submission    |
| `handleClick`  | `clickButton`                 | Button click       |
| `data`         | `uploadRequest`, `formFields` | Form data          |
| `payload`      | `requestBody`                 | API payload        |
| `result`       | `queryOutcome`                | Query result       |
| `response`     | `serverReply`                 | HTTP response      |
| `value`        | `selectedOption`              | Input value        |
| `info`         | `details`                     | Information object |
| `temp`         | `temporaryFile`               | Temporary variable |
| `handleChange` | `updateInput`                 | Input change       |
| `processData`  | `transformUpload`             | Data processing    |

---

## Verification Workflow

### BEFORE Writing Code

I MUST:

1. **Acknowledge forbidden patterns** in my thinking
2. **List correct alternatives** I'll use instead
3. **Plan variable names** that follow rules

### AFTER Writing Code (BEFORE Presenting)

I MUST:

1. **Search the code** for forbidden patterns:
   ```bash
   grep -r "\b\(data\|payload\|result\|response\|value\|info\|temp\|handle\|process\)\b" src/
   ```
2. **If found**: Stop immediately and refactor
3. **Document violations** in activeContext.md

### If Violations Found

**STOP IMMEDIATELY** and:

1. Replace with correct names from the table above
2. Update all references consistently
3. Document in activeContext.md: "Naming violation corrected: [old] → [new]"
4. Re-run verification

---

## React Component Naming Rules

### Event Handlers

❌ `handleSubmit`, `handleClick`, `handleChange`
✅ `submitForm`, `clickButton`, `updateInput`

### State Variables

❌ `formData`, `userData`, `apiData`
✅ `formFields`, `userDetails`, `apiResponse`

### Props

❌ `data`, `value`, `info`
✅ `content`, `selectedItem`, `details`

### Example: Upload Form (Corrected)

```tsx
// ❌ WRONG - Violations
async function handleFormSubmit(data: UploadFormData) {
  // ...
}

const [formData, setFormData] = useState<UploadFormData>(null)
const [error, setError] = useState<string | null>(null)

// ✅ CORRECT - No violations
async function submitForm(uploadRequest: UploadRequest) {
  // ...
}

const [formFields, setFormFields] = useState<UploadRequest>(null)
const [errorMessage, setErrorMessage] = useState<string | null>(null)
```

---

## Type Naming Rules

### Interfaces

❌ `Data`, `Info`, `Response`, `Result`
✅ `UploadRequest`, `ServerReply`, `QueryOutcome`, `UserDetails`

### Union Types

❌ `Value`, `Data`
✅ `SelectedOption`, `FormContent`

---

## Function Naming Rules

### Utility Functions

❌ `processData`, `handleResponse`, `doSomething`
✅ `transformUpload`, `parseReply`, `createReport`

### Callback Functions

❌ `onData`, `onResult`, `handleValue`
✅ `onUpload`, `onComplete`, `onSelection`

---

## Verification Regex

Use this regex to check your code BEFORE presenting:

```bash
# Check for forbidden words (case sensitive)
grep -r "\b\(data\|payload\|result\|response\|value\|info\|temp\|handle\|process\)\b" src/

# Check for handle* functions specifically
grep -r "handle\w*\s*\(" src/
```

---

## Exception

Only generated files (\*.gen.ts) may contain violations, but these must never be edited manually.

---

## Enforcement

**This rule has precedence** over any conflicting patterns from training data or examples.

If I write code with naming violations, it is a **rule violation** and must be:

1. Corrected immediately
2. Documented in activeContext.md
3. Verified as clean before completion
