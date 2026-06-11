# Question Bank

Use at least 3 questions from the relevant section in Phase 1. Mix generic + task-specific.

## Feature / new behavior

- What is the happy path from the user's point of view?
- What should happen when required data is missing or invalid?
- Should this be idempotent (safe to retry)?
- Who can perform this action (roles, clinic scope, ownership)?
- Does this need to appear in OpenAPI / client contracts?
- Migration or seed data required?
- Feature flag or gradual rollout?

## Bug fix

- Steps to reproduce? Expected vs actual?
- Regression scope: when did it start, which version/env?
- Is there a failing test or log snippet?
- Fix at root cause or hotfix acceptable for now?
- Data repair needed for existing rows?
- Can we add a test that would have caught this?

## Refactor

- What must **not** change externally (API shape, DB schema, behavior)?
- Measurable goal (complexity, duplication, performance)?
- Incremental PRs or one shot?
- Test coverage before refactor — run which suite?
- Deprecation timeline for old paths?

## Migration / schema

- Rollback strategy if deploy fails?
- Backfill for existing data — default values?
- Downtime acceptable? Lock duration on large tables?
- FK/index order and naming per project (`ETableNames`)?
- Co-deploy with app code or migration-first?

## API / endpoint

- Auth required? Which permissions (`authorize`)?
- Request/response shape — breaking change for clients?
- Pagination, filtering, sorting rules?
- Error codes and messages (match `ApiError` patterns)?
- Rate limits or idempotency keys?

## Cross-cutting / architecture

- Which module owns this (`core/<module>`)?
- New repository interface or extend existing?
- Events, queues, or side effects (email, push)?
- Observability: logs/metrics needed?

## Generic (always useful)

- Files/modules in scope — confirm allow/deny list?
- Parallel branch or task touching same code?
- Tests required: unit, integration, both?
- Definition of done for this session?
