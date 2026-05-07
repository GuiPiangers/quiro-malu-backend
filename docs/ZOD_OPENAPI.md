# Zod (validação de request) e OpenAPI / Swagger

Este documento descreve o padrão do projeto para validar corpos, params e query em **controllers** e para manter a **documentação da API** alinhada aos mesmos schemas.

## Visão geral

- **Zod** valida dados de entrada antes de chamar use cases.
- **`@asteasolutions/zod-to-openapi`** gera trechos OpenAPI a partir dos mesmos schemas Zod (`.openapi("NomeDoSchema")`).
- **`swagger-ui-express`** expõe a UI em **`GET /docs`** e o JSON em **`GET /openapi.json`** (`src/app.ts`).

## Onde fica cada coisa

| O quê | Onde |
|--------|------|
| `z` já estendido com OpenAPI (`extendZodWithOpenApi`) | `src/schemas/zodOpenApi.ts` — **importe sempre `z` daqui** em schemas que vão para a spec |
| Schemas globais / não ligados a um controller de rota (ex.: health) | `src/schemas/*.ts` (ex.: `healthSchemas.ts`) |
| Schemas de **request/response de uma rota** | **Ao lado do controller** que usa: `*Schemas.ts` na mesma pasta do `*Controller.ts` (ex.: `createUserController/createUserSchemas.ts`) |
| Registro `registerPath` das rotas | `src/docs/paths/<area>Paths.ts` |
| Registry e componentes comuns (ex.: `bearerAuth`) | `src/docs/registry.ts` |
| Agregação dos paths (imports com side-effect) | `src/docs/registerOpenApiPaths.ts` |
| Geração do documento OpenAPI 3.1 | `src/docs/swagger.ts` → `generateOpenApiDocument()` |

**Por quê schemas ao lado do controller?** Facilita ver, num único diretório, o handler HTTP e o contrato de entrada/saída daquela rota. Schemas compartilhados só por documentação podem continuar importando uns aos outros; paths em `src/docs/paths/` importam os schemas onde estiverem.

## Validação no controller (padrão)

1. Defina o schema com `z` vindo de `src/schemas/zodOpenApi.ts` e use `.openapi("IdEstável")` para aparecer na documentação.
2. No `handle`, use os helpers de `src/utils/zodValidation.ts`:
   - **`parseWithSchema(schema, request.body)`** (ou `request.params` / `request.query`).
   - Se `!parsed.success`, retorne **`sendZodBadRequest(response, parsed.error)`** (HTTP 400 com `flatten()`).
3. Só então chame o use case com `parsed.data`.
4. Erros de domínio continuam com **`throw new ApiError`** no use case e **`responseError(response, err)`** no controller (`docs/PROJECT_GUIDE.md` / `docs/CONTROLLER_GUIDE.md`).

Exemplo mínimo:

```typescript
const parsed = parseWithSchema(MeuBodySchema, request.body);
if (!parsed.success) {
  return sendZodBadRequest(response, parsed.error);
}
await this.meuUseCase.execute(parsed.data);
```

## Documentação Swagger / OpenAPI

1. No arquivo de schemas da rota (ou em `src/schemas` se for transversal), exporte os `z.object(...).openapi(...)`.
2. Em `src/docs/paths/<feature>Paths.ts`, importe `openApiRegistry` de `../registry` e chame **`openApiRegistry.registerPath({ method, path, request, responses, tags, summary, ... })`** usando os mesmos Zod schemas em `request.body.content` / `responses[status].content`.
3. Adicione **`import "./paths/<feature>Paths"`** em `src/docs/registerOpenApiPaths.ts` para o registro rodar na subida da aplicação.
4. Para rotas JWT, use `security: [{ bearerAuth: [] }]` quando fizer sentido; o scheme `bearerAuth` já está registrado em `src/docs/registry.ts`.

Regra de ouro: **um schema, duas leituras** — o controller valida com ele e o OpenAPI descreve o contrato com o mesmo objeto Zod, evitando divergência entre código e documentação.

## Referências no repositório

- Auth (exemplo de schemas colocados no controller): `src/core/authentication/controllers/*/*Schemas.ts` e `src/docs/paths/authPaths.ts`.
- Health (schema em `src/schemas`): `src/schemas/healthSchemas.ts`, `src/docs/paths/healthPaths.ts`.
