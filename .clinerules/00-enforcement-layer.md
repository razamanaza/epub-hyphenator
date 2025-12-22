# Enforcement Layer (Workspace) - META RULE

## Purpose

This file is the **master switch** for all global and workspace .clinerules. It **overrides all other rules** by making compliance **mandatory and verifiable**.

## Core Principle

Global rules are **LAW**, not suggestions. This file provides the enforcement mechanism.

---

## Pre-Task Requirements

### BEFORE Starting ANY Task

I **MUST** explicitly state:

```
Active Rules Check:
✅ Global 00-core-engineering.md (naming rules)
✅ Global 10-typescript.md (type rules)
✅ Global 20-testing.md (testing philosophy)
✅ Global 80-memory-bank.md (documentation)
✅ Global 81-self-improving-cline.md (reflection)
✅ Global 91-sequential-thinking.md (complex problem solving)
✅ Workspace 01-naming-enforcement.md (verification)
✅ Workspace 11-typescript-enforcement.md (strict)
✅ Workspace 50-context7-mandatory.md (documentation)
✅ Workspace 82-self-improvement-mandatory.md (reflection)
✅ Workspace 99-verification-checklist.md (final check)
```

### If Any Rule Conflicts

- Workspace rules **extend** global rules
- If conflict: Workspace takes precedence
- Document the override in activeContext.md

---

## Task Classification

### Simple Tasks (< 30 minutes, single file)

- ✅ Follow all rules
- ✅ No pre-task checklist required
- ✅ Standard post-task verification

### Complex Tasks (> 30 minutes, multiple files)

- ✅ **MANDATORY** pre-task checklist
- ✅ Use sequential thinking tool for planning
- ✅ Post-task verification + self-improvement offer

### Library/Framework Tasks (React, TanStack, tRPC, etc.)

- ✅ **MANDATORY** Context7 documentation lookup
- ✅ Base implementation on docs, NOT training data
- ✅ Full verification checklist

---

## Post-Task Verification

### BEFORE attempt_completion (ALL tasks)

Run this checklist:

```bash
# Naming violations check
grep -r "\b\(data\|payload\|result\|response\|value\|info\|temp\|handle\|process\)\b" src/

# Type suppression check (forbidden except *.gen.ts)
grep -r "@ts-ignore\|@ts-expect-error\|eslint-disable.*@typescript-eslint/no-explicit-any" src/ --exclude="*.gen.ts"

# Context7 usage verification (for framework tasks)
# [Manual check: Did I use cEdhNd0mcp0resolve-library-id and cEdhNd0mcp0get-library-docs?]
```

### If Violations Found

**STOP IMMEDIATELY** and:

1. Fix all violations
2. Document the violation in activeContext.md
3. Re-run verification

### Self-Improvement Trigger

**ALWAYS** ask before attempt_completion:

- If conversation > 3 messages → "Would you like me to reflect on this interaction?"
- If ANY user feedback → "Would you like me to suggest .clinerules improvements?"

---

## Memory Bank Integration

### Significant Changes

- ✅ Update activeContext.md with new patterns learned
- ✅ Update progress.md with completed work
- ✅ Update systemPatterns.md if architecture changes

### Rule Violations

- ✅ Document in activeContext.md: "Rule violation occurred - [details]"
- ✅ Update progress.md: "Improved compliance with [rule]"

---

## Override Authority

This file has **final authority** over all other rules. If any other rule conflicts with mandatory compliance, this file takes precedence.

**No exceptions. No compromises.**

---

## Verification

This rule is verified by:

- Explicit pre-task acknowledgment
- Post-task verification checklist
- Self-improvement reflection when triggered
- Memory bank updates
