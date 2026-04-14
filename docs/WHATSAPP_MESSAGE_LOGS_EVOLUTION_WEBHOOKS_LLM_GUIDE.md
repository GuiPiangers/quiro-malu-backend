# Guia guiado (LLM): logs de mensagens WhatsApp via webhooks da Evolution API

Este documento é um **passo a passo** para implementar rastreamento de envio e entrega de mensagens WhatsApp usando a **Evolution API** e seus **webhooks**, garantindo correlação entre o envio na aplicação e os status reportados pelo WhatsApp.

**Público-alvo:** assistente/LLM implementando no backend Node/TypeScript (ex.: este repositório).

**Pré-requisitos:** Evolution API em execução; instância WhatsApp (Baileys); URL pública para receber webhooks em produção.

---

## 1. Contexto: o que os webhooks resolvem

- O envio via HTTP (`sendText`, etc.) pode retornar sucesso com a mensagem **ainda na fila** da Evolution.
- O evento **`SEND_MESSAGE`** costuma refletir o envio imediato com status **`PENDING`** (mensagem enfileirada no lado Evolution).
- Atualizações de status no WhatsApp chegam em eventos do tipo **`messages.update`** (ou equivalente na sua versão da Evolution), com campos como **`SERVER_ACK`**, **`DELIVERY_ACK`**, **`READ`**, **`ERROR`** — use isso para persistir o estado real da mensagem.

> **Importante:** nomes exatos de eventos e formato de `req.body` podem variar entre versões da Evolution API. Sempre confira a documentação da versão que você usa e ajuste parsers e nomes de eventos.

---

## 2. Tabela de status (Evolution / WhatsApp)

| Status Evolution | Significado | Analogia no WhatsApp |
|------------------|-------------|----------------------|
| `PENDING` | Mensagem na fila da Evolution | Relógio |
| `SERVER_ACK` | Servidor WhatsApp recebeu a mensagem | ✓ (um tick) |
| `DELIVERY_ACK` | Dispositivo do destinatário recebeu | ✓✓ (dois ticks) |
| `READ` | Destinatário leu | ✓✓ azul |
| `ERROR` | Falha no envio | — |

Use esta tabela para **mapear** status externos → status internos do seu domínio (ver passo 4).

---

## 3. Passo 1 — Configurar webhook na criação da instância

Ao criar a instância, habilite webhook e liste os eventos necessários para **status de envio** e **atualizações de mensagem**.

**Referência neste projeto:** `src/providers/whatsapp/EvolutionWhatsAppProvider.ts` — hoje `createInstance` envia apenas `instanceName`, `qrcode` e `integration`. Estenda o body para incluir `webhook` conforme a API da sua versão Evolution.

Exemplo ilustrativo (ajustar URL, eventos e flags à documentação oficial):

```typescript
// Exemplo conceitual — alinhar com a Evolution API em uso
async createInstance(instanceName: string) {
  await fetch(`${this.baseUrl}/instance/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: this.apiKey },
    body: JSON.stringify({
      instanceName,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
        enabled: true,
        url: `${process.env.APP_URL}/webhooks/whatsapp`,
        events: [
          "MESSAGES_UPDATE", // status de entrega (confirmar nome na doc)
          "SEND_MESSAGE",    // confirmação / PENDING após envio
        ],
        webhookByEvents: false,
      },
    }),
  });
}
```

**Checklist LLM**

- [ ] Definir variável de ambiente pública (`APP_URL` ou `SERVER_URL`) sem barra final duplicada na URL final do webhook.
- [ ] Confirmar na doc Evolution se os eventos são `MESSAGES_UPDATE` / `SEND_MESSAGE` ou strings diferentes (ex.: `messages.update` só no payload, não na config).

---

## 4. Passo 2 — Rota HTTP para receber o webhook

- Expor **`POST`** em um path estável (ex.: `/webhooks/whatsapp`).
- Responder **200** rapidamente após enfileirar processamento ou após validação básica, para a Evolution não reentregar em excesso (ou processar async conforme política do projeto).
- **Validar** origem se a Evolution permitir (token, assinatura, IP — conforme doc).

Exemplo ilustrativo:

```typescript
// Conceito: registrar em src/router.ts e delegar a um controller fino (ver docs/CONTROLLER_GUIDE.md)
router.post("/webhooks/whatsapp", async (req, res) => {
  const { event, data, instance } = req.body;

  if (event === "messages.update") {
    await updateMessageStatusUseCase.execute({
      instanceName: instance,
      messageId: data.key.id,
      status: data.update.status,
    });
  }

  // Opcional: tratar SEND_MESSAGE para gravar PENDING + providerMessageId

  res.status(200).send("ok");
});
```

**Checklist LLM**

- [ ] Não expor dados sensíveis em logs brutos do body.
- [ ] Mapear `instance` → `userId`/clínica se o modelo de dados for multi-tenant (via `IWhatsAppInstanceRepository` ou equivalente).

---

## 5. Passo 3 — Caso de uso `UpdateMessageStatus`

Responsabilidade: dado `instanceName`, `messageId` (id no provedor) e `status` bruto, **atualizar** o registro de log correlacionado por `providerMessageId`.

```typescript
// Tipos internos sugeridos
type MessageStatus = "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";

// Mapeamento sugerido Evolution → domínio
const statusMap: Record<string, MessageStatus> = {
  SERVER_ACK: "SENT",
  DELIVERY_ACK: "DELIVERED",
  READ: "READ",
  ERROR: "FAILED",
};
```

**Checklist LLM**

- [ ] Se o status não existir no mapa, retornar sem erro (idempotente).
- [ ] Atualizar timestamps: `deliveredAt`, `readAt` quando aplicável.
- [ ] Em `ERROR`, persistir `errorMessage` se vier no payload.

---

## 6. Passo 4 — Modelo / persistência do log

Ao **enviar** mensagem pela aplicação, já persistir um log com:

- `providerMessageId` retornado pelo provider (ex.: `SendMessageResult.providerMessageId` em `EvolutionWhatsAppProvider.sendMessage`).
- `status: "PENDING"` (ou `SENT` se preferir semântica própria).
- `patientId`, telefone, texto renderizado, `userId`, origem (campanha, lembrete, manual), etc.

Campos úteis para relatórios e webhooks:

| Campo | Uso |
|--------|-----|
| `providerMessageId` | Correlação com `messages.update` |
| `status` | Estado atual no domínio |
| `sentAt` | Quando a API aceitou o envio |
| `deliveredAt` | Quando recebeu `DELIVERY_ACK` |
| `readAt` | Quando recebeu `READ` |
| `errorMessage` | Falhas (`ERROR`) |

Seguir padrões do projeto: `docs/USECASE_GUIDE.md`, `docs/REPOSITORY_GUIDE.md`, `ApiError` + `responseError` onde couber.

---

## 7. Passo 5 — Relatórios / listagens

Implementar use cases + repositório para:

- Listar logs paginados (`limit`, `offset` / `page`).
- Filtrar por `userId`, opcionalmente campanha ou paciente.
- Agregados (`summary`): totais por `PENDING`, `SENT`, `DELIVERED`, `READ`, `FAILED` e taxas (`deliveryRate`, `readRate`) se fizer sentido de negócio.

**Rotas sugeridas para painel (exemplos)**

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/messages/logs?page=1&campaignId=...` | Histórico geral |
| `GET` | `/messages/logs/patient/:patientId` | Por paciente |
| `GET` | `/messages/campaigns/:campaignId/report` | Resumo de campanha |

Proteger com o mesmo `authMiddleware` e escopo por `userId` do token.

---

## 8. URL pública obrigatória (produção e desenvolvimento)

- A Evolution precisa **alcançar** seu backend pela internet.
- **Produção:** `APP_URL` / domínio público (ex.: ALB, Coolify, etc.) apontando para a rota do webhook.
- **Desenvolvimento local:** túnel (ex. **ngrok**):

```bash
ngrok http 8000
# Usar a URL HTTPS retornada:
# WEBHOOK_URL=https://xxxx.ngrok-free.app/webhooks/whatsapp
```

Configure essa URL na criação/atualização da instância ou no painel da Evolution, conforme sua operação.

---

## 9. Ordem sugerida de implementação (para a LLM)

1. Modelo + migration/tabela (ou coleção) de **message log** com `providerMessageId` e status.
2. No **send** (`sendMessage` / use case que chama o provider), **salvar** log com `providerMessageId` e `PENDING`.
3. Estender **`createInstance`** (ou endpoint de settings) com **webhook** Evolution.
4. **Controller + rota** `POST /webhooks/whatsapp` + **UpdateMessageStatusUseCase** + repositório `updateByProviderMessageId`.
5. Testes unitários no use case (mapa de status, idempotência) e, se possível, teste de contrato com payload de exemplo da doc Evolution.
6. **Listagens e summary** + rotas GET para o painel.

---

## 10. Referências no repositório

- Provider Evolution: `src/providers/whatsapp/EvolutionWhatsAppProvider.ts`
- Contrato do provider: `src/providers/whatsapp/IWhatsAppProvider.ts`
- Rotas: `src/router.ts`
- Padrão de controllers: `docs/CONTROLLER_GUIDE.md`

---

## 11. Implementação atual neste backend (lembretes de agendamento)

### Correlação webhook ↔ log

1. **`SendBeforeScheduleMessageUseCase`** (`src/core/messages/useCases/sendBeforeScheduleMessage/sendBeforeScheduleMessageUseCase.ts`), após `sendMessage`:
   - Se `success`: grava em **`whatsapp_message_logs`** o campo **`message`** com o texto **já renderizado** enviado ao paciente, `status: PENDING`, e **`providerMessageId`** retornado pela Evolution (`response.data.key.id` no provider), quando existir.
   - Se `success` sem `providerMessageId`: o log fica `PENDING` com `providerMessageId` nulo — **o webhook não conseguirá atualizar essa linha** até haver outro mecanismo de correlação. Garanta que a Evolution retorne o id da mensagem no envio.
   - Se `success: false`: grava `status: FAILED` com `errorMessage`, sem depender de webhook.

2. **`POST /webhooks/whatsapp`** (`WhatsAppWebhookController`) chama **`ProcessWhatsAppWebhookUseCase`**, que interpreta eventos no formato `messages.update` e chama **`updateByProviderMessageId`** no **`KnexWhatsAppMessageLogRepository`**.

3. Mapeamento Evolution → log: `SERVER_ACK` → `SENT`; `DELIVERY_ACK` → `DELIVERED`; `READ` → `READ`; `ERROR`/`FAILED` → `FAILED`.

4. Segurança opcional: variável **`WHATSAPP_WEBHOOK_SECRET`** no `.env` — se definida, a rota exige o mesmo valor em **`x-webhook-secret`**, **`x-webhook-token`** ou **`apikey`**.

5. Migration: `src/database/migrations/20260410120000_create_whatsapp_message_logs.ts`.

---

## 12. Notas finais

- **`SEND_MESSAGE`** e **`messages.update`** complementam-se: o primeiro ajuda a confirmar aceite/fila; o segundo confirma progressão no WhatsApp (**ticks**).
- Mantenha o processamento do webhook **idempotente** (mesmo `messageId` + mesmo status pode repetir).
- Revise periodicamente a documentação da **versão exata** da Evolution API instalada (Coolify / Docker) para eventos e formato JSON.
