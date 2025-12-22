# Self-Improvement Enforcement (Workspace) - Reinforces Global 81-self-improving-cline.md

## Purpose

**MANDATORY** self-improvement reflection before EVERY `attempt_completion`. Upgrades global rule from optional to required.

---

## Hard Rule

Before EVERY `attempt_completion`:

1. Count conversation messages
2. If conversation > 3 messages OR user provided any correction/feedback:
   - MUST ASK: "Would you like me to reflect on this interaction?"
   - If yes, review ALL active rules for violations
   - Suggest specific improvements with diff blocks

## This is NOT Optional

Self-improvement skipped = rule violation.

---

## Trigger Conditions

### Mandatory Triggers

**ALWAYS** trigger self-improvement when:

1. **Conversation Length**: > 3 messages exchanged
2. **User Feedback**: Any correction, suggestion, or dissatisfaction expressed
3. **Task Complexity**: Multi-step tasks or complex changes
4. **Rule Violations**: Any suspected violations found during verification

### Example Triggers

✅ **Trigger Required**:

- "This naming is wrong" → User feedback → Reflect
- 5+ messages in conversation → Length → Reflect
- Complex feature implementation → Complexity → Reflect

❌ **No Trigger**:

- Single message task → No reflection needed
- "Looks good" with no corrections → No reflection needed

---

## Process Workflow

### Step 1: Self-Assessment

Before asking user:

1. Review conversation history
2. Check for user feedback/corrections
3. Identify potential rule violations
4. Prepare specific improvement suggestions

### Step 2: User Interaction

```markdown
Would you like me to reflect on this interaction and suggest potential improvements to the active .clinerules?

**What I noticed:**

- [Specific feedback/corrections]
- [Potential rule violations]
- [Areas for improvement]
```

### Step 3: If User Says Yes

Provide detailed analysis:

1. **Review all active rules** for violations
2. **Suggest specific improvements** with diff blocks
3. **Propose .clinerules updates** if needed

### Step 4: If User Says No

Proceed with `attempt_completion` (no violation)

---

## Examples

### Example 1: Naming Violation Feedback

**User:** "Don't use `handleX` functions - use proper names"

**Cline MUST:**

1. Acknowledge trigger (user feedback)
2. Offer reflection
3. If accepted: Review naming rules, suggest strengthening enforcement

### Example 2: Long Conversation

**Conversation:** 8 messages about implementing a feature

**Cline MUST:**

1. Count messages (>3)
2. Offer reflection
3. If accepted: Review entire interaction for rule compliance

---

## Reflection Content

When user accepts reflection, provide:

### 1. Interaction Summary

- What was accomplished
- User feedback received
- Challenges encountered

### 2. Rule Compliance Review

- ✅ Rules followed correctly
- ❌ Rules violated (with examples)
- 🤔 Rules that could be clearer

### 3. Specific Improvement Suggestions

- Update rule wording for clarity
- Add missing trigger conditions
- Strengthen enforcement mechanisms

### 4. Proposed .clinerules Changes

```markdown
# Suggested Update to 01-naming-enforcement.md

## Add to Forbidden Patterns:

- `processX` functions (common violation)
- `doSomething` functions (too vague)
```

---

## Verification

### Before attempt_completion

I MUST verify:

- [ ] Counted conversation messages
- [ ] Checked for user feedback/corrections
- [ ] Offered reflection if triggers met
- [ ] Documented reflection results

### Documentation

If reflection performed:

- Update `activeContext.md` with insights
- Update `progress.md` with improvements made
- Document rule violations and fixes

---

## Why Mandatory

**Global rule is aspirational**: "Before using attempt_completion... involved user feedback"

**Workspace rule makes it concrete**:

- Specific triggers (message count, feedback detection)
- Required workflow (ask user, provide analysis)
- Verification steps (document results)

**Without this**: Self-improvement becomes optional, defeating the purpose.

---

## Enforcement

This rule **upgrades global 81-self-improving-cline.md** from:

- "Offer opportunities to continuously improve" (optional)

To:

- **"MUST offer reflection before EVERY attempt_completion when triggered"** (mandatory)

**Violation = Rule violation** requiring immediate correction.
