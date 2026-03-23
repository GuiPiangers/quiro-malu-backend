# Quiro Malu Backend Guides (Cursor)

Aplique a arquitetura do projeto seguindo os guias em `docs/` e os exemplos reais em `src/`.

## Quando abrir cada guia

- `docs/PROJECT_GUIDE.md`: estrutura do repo, `ApiError`, `DateTime`, padrões globais.
- `docs/CONTROLLER_GUIDE.md`: criar/alterar controllers e ligar rotas em `src/router.ts`.
- `docs/USECASE_GUIDE.md`: regra de negócio em classes `*UseCase` com `execute(...)`.
- `docs/ENTITY_GUIDE.md`: entidades em `models/` (`extends Entity` + `getDTO()`).
- `docs/REPOSITORY_GUIDE.md`: interfaces `I*Repository` + implementações (Knex + `ETableNames`).

## Regras obrigatórias

- Controllers sempre `handle(req, res)` + `try/catch` retornando `responseError(res, err)`.
- UseCases dependem de interfaces de repositório (não instanciar infra dentro do UseCase).
- Erros de domínio/API: sempre `throw new ApiError(...)`.
- Datas: sempre `DateTime` de `src/core/shared/Date.ts`; DTOs com string `yyyy-MM-ddTHH:mm`.
- Testes: `*.spec.ts` colocalizados perto do UseCase; mocks em `src/repositories/_mocks`.
