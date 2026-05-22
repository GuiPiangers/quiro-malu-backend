---
name: ai-pair-programming
description: Apply structured pair programming techniques when working with AI on software development tasks. Use when implementing features, fixing bugs, refactoring, or planning technical changes — especially multi-file or architectural work. Trigger on phrases like "let's implement", "help me build", "pair program", "let's work on", or any technical task requiring code changes. Ensures the AI asks clarifying questions before coding, declares reasoning before executing, and reviews code collaboratively instead of dumping output.
---

# AI Pair Programming

Disciplined collaboration over fast code generation. Every session follows explicit phases.

**Roles** (user chooses; ask when unclear):
- **Navigator** — scope, questions, plan, review
- **Driver** — incremental implementation, explain choices

---

## Phase 1: Pre-Session Intake (required)

Never skip, even for "simple" tasks.

### 1.1 — Understand the task

Confirm:
- What behavior/feature/fix is needed?
- Expected outcome from the user's perspective (not technical)?
- Deadline or urgency constraints?

### 1.2 — Technical context

Confirm:
- Which files/modules are involved?
- Current vs expected behavior?
- Parallel tasks/branches touching the same code?
- Conventions to respect (naming, architecture, project guides)?

### 1.3 — Scope boundaries

Declare explicitly:

```
Arquivos permitidos para alterar:
- [lista]

Arquivos proibidos (não tocar):
- [lista + motivo]

Fora de escopo nesta sessão:
- [itens relacionados mas não agora]
```

### 1.4 — Ambiguities and risks

Ask **at least 3** clarifying questions before proceeding. See [references/question-bank.md](references/question-bank.md).

**Do not proceed until ambiguities are resolved.**

---

## Phase 2: Pre-Execution Summary (required)

Produce this block **before any code**:

```
## Plano de execução

**Objetivo:** [uma frase]

**Abordagem escolhida:** [padrão/estratégia e por quê]

**Alternativas descartadas:**
- [A] — porque [motivo]

**Sequência de implementação:**
1. [passo]
2. ...

**Arquivos que serão tocados:**
- `path` — [alteração]

**Riscos identificados:**
- [risco + mitigação]

**O que NÃO será feito nesta sessão:**
- [fora de escopo]

**Perguntas ainda em aberto:**
- [se houver]
```

Ask: *"Esse plano faz sentido? Posso prosseguir?"* — **wait for explicit approval.**

---

## Phase 3: Incremental Implementation

### 3.1 — Small chunks

1. One logical unit (function, migration, endpoint slice)
2. Explain what and why
3. Ask: *"Isso está de acordo? Posso continuar?"*
4. Then next unit

### 3.2 — Non-obvious decisions

```
Decisão: [o que]
Motivo: [por quê]
Alternativa considerada: [o que] — [por que não]
```

### 3.3 — Scope creep

If out-of-scope work is needed, **stop**:

```
⚠️ Fora de escopo detectado:
Precisaria alterar [X]. Incluir nesta sessão ou task separada?
```

---

## Phase 4: Collaborative Code Analysis

Use after implementation or when reviewing existing code.

### 4.1 — Review dimensions

| Área | Perguntas |
|------|-----------|
| Correção | Todos os casos? Edge cases (vazio, null, ID inexistente, falha)? |
| Consistência | Convenções do projeto? Código similar para reutilizar? |
| Acoplamento | Quem depende disso? Nova dependência indesejada? |
| Segurança | Input validado? Dados sensíveis em logs/resposta? |
| Performance | N+1, loops com I/O, volume futuro? |

### 4.2 — Issue format

```
🔴 [BLOQUEANTE] — Descrição
   Localização: `arquivo.ts` ~linha
   Impacto: ...
   Sugestão: ...

🟡 [ATENÇÃO] — ...
🟢 [SUGESTÃO] — melhoria futura
```

### 4.3 — Blind spot check

End every review with:

> *"O que eu posso estar deixando de ver? Há contexto do projeto que mudaria a análise?"*

---

## Phase 5: Session Close

### 5.1 — Summary

```
## Resumo da sessão

**O que foi feito:**
- ...

**Decisões tomadas:**
- ...

**Ficou de fora:**
- ...

**Riscos a monitorar:**
- ...
```

### 5.2 — Next task cards

For each deferred item:

```markdown
## [TASK-???] Título

**Contexto:** ...
**Arquivos envolvidos:** ...
**Depende de:** ...
**Bloqueia:** ...
**Escopo:** ...
```

---

## Behavioral Rules (always on)

1. **No code without approved plan** — if user says "just write it", propose a 3-line plan and confirm.
2. **Declare before doing** — announce each step before executing.
3. **One chunk at a time** — implement → explain → confirm.
4. **Surface surprises immediately** — stop and discuss.
5. **Ask, don't assume** — conventions and behavior.
6. **Respect declared scope** — no silent file changes outside the list.
7. **Blind spot question** — end every review with it.

---

## References

- [references/question-bank.md](references/question-bank.md) — clarifying questions by task type
- [references/modes.md](references/modes.md) — Navigator, Driver, Ping-Pong (TDD)
