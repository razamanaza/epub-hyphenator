# Final Verification Checklist (Workspace)

## Purpose

**MANDATORY** final checklist before ANY `attempt_completion`. Ensures all global and workspace rules are actively enforced.

---

## Pre-Attempt-Completion Verification

### BEFORE attempt_completion (EVERY TIME)

I MUST verify ALL of the following:

#### Rule Compliance

- [ ] **Naming Rules**: Searched for forbidden patterns (`data`, `payload`, `handleX`, etc.)
- [ ] **TypeScript Rules**: No suppressions (`@ts-ignore`, `@ts-expect-error`) except in \*.gen.ts
- [ ] **Context7 Usage**: Used for framework/library code (React, TanStack, tRPC, etc.)
- [ ] **Self-Improvement**: Offered reflection if >3 messages or user feedback received

#### Code Quality

- [ ] **No Forbidden Names**: Variables, functions, interfaces don't use banned words
- [ ] **Proper TypeScript**: No `any` without narrowing, proper unions over enums
- [ ] **Memory Bank Updated**: Significant changes documented in activeContext.md
- [ ] **Testing Philosophy**: Core logic tested, not just implementation details

#### Task Classification Applied

- [ ] **Simple Tasks** (<30min, single file): Standard verification
- [ ] **Complex Tasks** (>30min, multiple files): Sequential thinking used
- [ ] **Framework Tasks**: Context7 documentation consulted

---

## Verification Commands

### Run Before Completion

```bash
# Naming violations check
grep -r "\b\(data\|payload\|result\|response\|value\|info\|temp\|handle\|process\)\b" src/

# Type suppression check (forbidden except *.gen.ts)
grep -r "@ts-ignore\|@ts-expect-error\|eslint-disable.*@typescript-eslint/no-explicit-any" src/ --exclude="*.gen.ts"

# Any usage check (allowed with narrowing)
grep -r "\bany\b" src/ --exclude="*.gen.ts"

# Handle* function check
grep -r "handle\w*\s*\(" src/
```

---

## If Violations Found

**STOP IMMEDIATELY** and:

1. **Fix all violations** immediately
2. **Document in activeContext.md**: "Rule violation corrected: [details]"
3. **Re-run verification** to confirm clean
4. **Update progress.md** if significant changes

### Common Corrections

#### Naming Violations

❌ `handleFormSubmit(data: UploadFormData)` → ✅ `submitForm(uploadRequest: UploadRequest)`

#### Type Violations

❌ `@ts-ignore` → ✅ Proper type narrowing with `typeof`, `in`, `instanceof`

#### Missing Context7

❌ "Based on training data" → ✅ "Consulted Context7 docs for [library] patterns"

---

## Self-Improvement Check

### Mandatory Triggers Met?

- [ ] Conversation > 3 messages → Offered reflection
- [ ] User provided feedback → Offered reflection
- [ ] Complex task completed → Offered reflection

### If Required But Skipped

**This is a rule violation** - document and offer reflection now.

---

## Memory Bank Updates

### What to Update

- [ ] **activeContext.md**: New patterns learned, challenges encountered
- [ ] **progress.md**: Completed work, known issues
- [ ] **systemPatterns.md**: Architecture changes or new patterns discovered
- [ ] **techContext.md**: Technology decisions made

### When to Update

- Significant feature implementation
- Rule violations corrected
- New patterns discovered
- User feedback incorporated

---

## Final Checklist Completion

### All Boxes Checked?

- [ ] Rule compliance verified
- [ ] Code quality confirmed
- [ ] Self-improvement offered (if triggered)
- [ ] Memory bank updated
- [ ] No outstanding violations

### Ready for attempt_completion?

**ONLY IF** all items above are ✅ confirmed.

If ANY item is unchecked → **Fix immediately** before proceeding.

---

## Documentation

### For This Checklist

- [ ] Checked before every attempt_completion
- [ ] All violations corrected and documented
- [ ] Self-improvement offered when required
- [ ] Memory bank updates completed

---

## Why This Matters

**Without this checklist**: Rules become suggestions, not requirements.

**With this checklist**: Active enforcement ensures consistent quality and compliance.

**Violation of this rule**: Immediate correction required - cannot proceed without verification.

---

## Emergency Override

**Only for critical system issues** - document override reason in activeContext.md:

```
EMERGENCY OVERRIDE: [reason]
- Rule violated: [which]
- Justification: [why]
- Plan to correct: [when/how]
```

**Normal operation**: No overrides allowed.
