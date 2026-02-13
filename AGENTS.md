# Repository Guidelines

## Project Structure & Module Organization
Main application code lives in `src/`. Entry points are `src/server.ts` (runtime) and `src/app.ts` (Express app wiring).  
Business logic follows a modular layout in `src/core/<module>/` with:
- `models/` for domain entities
- `useCases/` for application logic
- `controllers/` for HTTP handlers

Persistence and external integrations are under `src/repositories/` and `src/database/` (Knex, Mongoose, Redis, BullMQ, S3, Azure).  
Tests are colocated as `*.spec.ts` files (for example `src/core/patients/useCases/createPatient/tests/CreatePatient.spec.ts` and `src/core/shared/tests/Email.spec.ts`).  
Operational assets live in `deploy/`, `nginx/`, `prometheus/`, `grafana/`, `loki/`, and `promtail/`.

## Build, Test, and Development Commands
- `npm run dev`: starts local API with hot reload (`ts-node-dev`) on port `8000` by default.
- `npm run build`: compiles TypeScript to `build/`.
- `npm start`: runs compiled server from `build/src/server.js`.
- `npm run test`: runs Jest test suite (`--maxWorkers=50%`).
- `npm run test:watch`: watch mode for local TDD.
- `npm run test:coverage`: generates coverage report in `coverage/`.
- `npm run knex:migrate` / `npm run knex:rollback`: apply or rollback SQL migrations.

## Coding Style & Naming Conventions
Use TypeScript with strict mode enabled (`tsconfig.json`).  
Linting uses ESLint with `@rocketseat/eslint-config/node` (`.eslintrc.json`); fix lint issues before opening a PR.
- Prefer `camelCase` for files/folders in feature code.
- Keep controllers thin and delegate behavior to use cases.
- Throw domain/API errors using `src/utils/ApiError.ts` and return controller errors via `responseError`.
- For tests, use `*.spec.ts`.

## Testing Guidelines
Framework: Jest with `ts-jest` (`jest.config.ts`).  
Default pattern is `**/**/*.spec.ts`; keep tests near the module they validate.  
Coverage is collected from `src/**/*.ts` with exclusions for wiring/infrastructure layers; prioritize assertions around `core` models and use cases.

## Commit & Pull Request Guidelines
Recent history mostly follows lightweight Conventional Commit prefixes (`fix:`, `chore:`). Continue this style:
- `fix: correct schedule date parsing`
- `chore: update env sample`

PRs should include:
- clear summary and impacted modules
- migration/config changes (if any)
- test evidence (`npm run test` or coverage output)
- linked issue/ticket when available

## Security & Configuration Tips
Never commit real secrets from `.env`. Use `.env.sample` as the template.  
When changing database schema, ship migration plus rollback-safe code in the same PR.

## Architecture
- READ file `docs/CONTROLLER_GUIDE.md` to create an controller
- READ file `docs/USECASE_GUIDE.md` to create an use case
- READ file `docs/REPOSITORY_GUIDE.md` to create an repository
- READ file `docs/ENTITY_GUIDE.md` to create an entity