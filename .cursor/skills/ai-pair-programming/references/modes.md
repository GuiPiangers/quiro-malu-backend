# Pair Programming Modes

User picks the mode at session start. Switching mid-session is OK — state it explicitly.

## Navigator (AI as navigator, user drives)

**AI:**
- Runs Phase 1 intake and Phase 2 plan
- Asks questions; does not edit files unless user asks for a snippet
- Reviews each chunk the user describes or pastes
- Flags scope creep and missing tests

**User:**
- Writes code in IDE
- Shares diffs or describes what they changed

**When to use:** Learning, sensitive areas, or user wants full control of keystrokes.

---

## Driver (AI as driver, user navigates)

**AI:**
- Still completes intake + approved plan first
- Implements in small chunks (Phase 3)
- Explains each decision; pauses for confirmation

**User:**
- Approves plan and each chunk
- Answers clarifying questions
- Supplies domain context the AI lacks

**When to use:** Default for "implement X in this repo" requests.

---

## Ping-Pong / TDD

**Cycle:**
1. User or AI writes a **failing** test (name the behavior)
2. Other implements **minimum** code to pass
3. Refactor if needed — only with green tests
4. Confirm; next test

**AI rules:**
- Never skip the failing-test step unless user explicitly waives TDD for this session
- One test at a time
- Plan lists test files in allowed scope

**When to use:** Bug fixes, pure logic, use cases with existing test patterns (`*.spec.ts`).

---

## Mode selection prompt

If unclear, ask:

> *"Quer que eu atue como **Driver** (eu implemento em passos), **Navigator** (você codifica e eu reviso), ou **Ping-Pong/TDD** (teste → implementação alternados)?"*
