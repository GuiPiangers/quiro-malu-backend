# Plano de implementação inicial: Clínicas (multi-tenant por `clinicId`)

Este plano segue os guias do projeto para **Entity / UseCase / Repository / Controller** e a documentação de **Zod + OpenAPI**.

## Objetivo

- Introduzir a entidade **Clinic** com os campos iniciais:
  - `id: string`
  - `name: string`
- Tornar **User obrigatório em relação a Clinic**:
  - User passa a ter `clinicId`
  - Só cria usuário vinculado a uma clínica existente
  - Uma clínica possui vários usuários; usuário pertence a uma clínica
- Migrar recursos para isolamento por clínica (tenant):
  - `finances`, `patients`, `services` e demais recursos passam a usar `clinicId` como chave de encaminhamento/autorização
  - **exceção:** `scheduling` mantém relação com `userId` (continua por usuário)

---

## Fase 0 — Mapeamento técnico (pré-implementação)

1. Levantar tabelas e repositórios que hoje filtram por `userId`:
   - buscar em `src/repositories` por `.where({ userId` e assinaturas com `userId: string`.
2. Listar endpoints impactados em `src/router.ts` e controllers associados.
3. Classificar cada recurso em:
   - **Migrar para clinicId**
   - **Manter userId (scheduling)**
4. Definir estratégia de compatibilidade temporária:
   - migração única com backfill + corte imediato, ou
   - rollout em 2 passos (dual-read/dual-write por curto período).

> Saída esperada: checklist de arquivos por módulo com impacto.

---

## Fase 1 — Banco de dados e contratos persistidos

1. Criar migration para tabela `clinics` (ou nome padrão do projeto via `ETableNames`):
   - colunas: `id` (PK), `name`.
2. Criar migration para adicionar `clinicId` em `users`:
   - coluna não nula (`NOT NULL`) após backfill.
   - FK `users.clinicId -> clinics.id`.
   - índice em `clinicId`.
3. Para módulos multi-tenant (`patients`, `services`, `finances` e demais):
   - adicionar coluna `clinicId`.
   - criar índices compostos relevantes (ex.: `clinicId + createdAt`, `clinicId + id`).
   - incluir FKs para `clinics.id`.
4. Backfill de dados existentes:
   - criar clínica default por tenant existente (ou por usuário, conforme regra de negócio decidida).
   - preencher `users.clinicId` e demais tabelas.
5. Garantir rollback seguro:
   - scripts/migrations reversíveis (`knex:rollback`) sem perda indevida.

---

## Fase 2 — Domínio (core): entidade e casos de uso de Clinic

1. Criar entidade em `src/core/clinics/models/Clinic.ts`:
   - `ClinicDTO { id?: string; name: string }`
   - classe `Clinic extends Entity` com `getDTO()`.
2. Criar contratos de repositório em `src/repositories/clinic`:
   - `IClinicRepository` com métodos mínimos:
     - `save(clinic: Clinic): Promise<Clinic>`
     - `findById(id: string): Promise<Clinic | null>`
     - `findByName(name: string): Promise<Clinic | null>` (opcional, se houver regra de unicidade)
3. Implementar `ClinicRepository` com Knex e `ETableNames`.
4. Criar `CreateClinicUseCase` em `src/core/clinics/useCases/createClinic`:
   - recebe DTO validado
   - aplica regras (ex.: nome obrigatório, unicidade se aplicável)
   - persiste e retorna DTO de saída.
5. (Opcional nesta fase) `ListClinicsUseCase`/`GetClinicUseCase` para suporte operacional.

---

## Fase 3 — API (controller + validação + OpenAPI)

1. Criar controller `CreateClinicController`:
   - `try/catch` + `responseError`.
   - validação com `parseWithSchema` e `sendZodBadRequest`.
2. Criar schema Zod ao lado do controller (`createClinicSchemas.ts`) usando `z` de `src/schemas/zodOpenApi.ts`.
3. Registrar rota em `src/router.ts` (ex.: `POST /clinics`).
4. Atualizar OpenAPI:
   - novo arquivo em `src/docs/paths/clinicPaths.ts` com `openApiRegistry.registerPath`.
   - importar em `src/docs/registerOpenApiPaths.ts`.

---

## Fase 4 — Users obrigatoriamente vinculados a clínica

1. Atualizar entidade/modelo/DTO de User para incluir `clinicId`.
2. Alterar fluxo de criação de usuário (`register/createUser`):
   - payload deve conter `clinicId` (ou fluxo alternativo com criação de clínica antes).
   - validar existência da clínica no use case (regra de negócio).
   - rejeitar criação sem clínica.
3. Ajustar repositórios e queries de User para ler/gravar `clinicId`.
4. Atualizar autenticação/token (se necessário):
   - incluir `clinicId` no contexto de `request.user` para escopo de dados.
5. Atualizar schemas Zod/OpenAPI de login/register/responses de usuário.

---

## Fase 5 — Migração de recursos para `clinicId`

> Regra geral: todo recurso funcional deve ser particionado por `clinicId`, exceto scheduling.

1. Para cada módulo (`patients`, `services`, `finances`, etc):
   - entidade passa a carregar `clinicId` quando fizer sentido de domínio.
   - use cases recebem `clinicId` do contexto autenticado.
   - repositórios substituem filtros `userId` por `clinicId`.
   - ajustar unicidade/consultas para escopo da clínica.
2. Controllers:
   - parametrize use cases com `request.user.clinicId`.
   - continuar incluindo o `request.user.userId` para validar autenticação
3. Rotas/docs:
   - manter contrato externo estável quando possível.
   - atualizar OpenAPI em mudanças de request/response.
4. Scheduling (exceção):
   - manter relação por `userId`.
   - apenas garantir consistência indireta com a clínica do usuário quando necessário para autorização.

---

## Fase 6 — Autorização e isolamento de tenant

1. Garantir que nenhum endpoint multi-tenant consulte por `id` puro sem `clinicId`.
2. Revisar middlewares/autorização para evitar acesso cruzado entre clínicas.
3. Adicionar testes de segurança:
   - usuário da clínica A não acessa dados da clínica B.
4. Adicionar ao payload de GenerateTokenProvider o clinicId para a identificação da clinica no token
5. Validar no authMiddleware a existência do clinicId no payload do token
---

## Fase 7 — Testes (unitário, integração e regressão)

1. Unitários (Vitest):
   - entidade Clinic
   - CreateClinicUseCase
   - CreateUserUseCase exigindo `clinicId`
   - use cases de patients/services/finances filtrando por `clinicId`.
2. Integração:
   - criar clínica → criar usuário vinculado → criar/listar recursos da clínica.
   - provar isolamento entre duas clínicas.
   - validar scheduling por usuário.
3. Regressão:
   - autenticação, fluxos legados principais.
4. Executar:
   - `npm run test`
   - `npm run test:coverage` (ideal)

---

## Fase 8 — Rollout e observabilidade

1. Deploy com migrations antes da versão da API (ou janela coordenada).
2. Monitorar erros de FK/validação pós-deploy.
3. Criar métricas/logs de contexto (`clinicId`) em operações críticas.
4. Plano de contingência:
   - rollback de app + rollback de migration (quando seguro).

---

## Checklist de entrega inicial (MVP)

- [ ] Tabela/entidade/repositório/use case/controller de Clinic criados
- [ ] `users.clinicId` obrigatório e validado na criação
- [ ] `patients`, `services`, `finances` com filtro por `clinicId`
- [ ] `scheduling` preservado com `userId`
- [ ] OpenAPI atualizado (`/docs` e `/openapi.json`)
- [ ] Testes cobrindo isolamento por clínica
- [ ] Migrations com rollback

## Ordem recomendada de execução (prática)

1. Migrations + repository de clinic
2. CreateClinic endpoint
3. Alterar criação de usuário para exigir `clinicId`
4. Migrar módulos críticos (`patients`, `services`, `finances`)
5. Ajustar demais módulos
6. Testes + documentação + rollout
