import { createMockWhatsAppMessageLogRepository } from "../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { ProcessWhatsAppWebhookUseCase } from "../ProcessWhatsAppWebhookUseCase";

describe("ProcessWhatsAppWebhookUseCase", () => {
  it("deve ignorar eventos que não são messages.update", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({ event: "connection.update", data: {} });

    expect(repo.updateByProviderMessageId).not.toHaveBeenCalled();
  });

  it("deve atualizar status pelo providerMessageId em messages.update", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({
      event: "messages.update",
      instance: "clinic-1",
      data: {
        key: { id: "msg-evolution-1" },
        update: { status: "SERVER_ACK" },
      },
    });

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith(
      expect.objectContaining({
        providerMessageId: "msg-evolution-1",
        status: "SENT",
        errorMessage: null,
      }),
    );
  });

  it("deve aceitar messages.update no formato plano (keyId + status) da Evolution v2", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({
      event: "messages.update",
      instance: "clinic-11d760d7-69a3-423e-a273-5f6eabdf35a5",
      data: {
        keyId: "3EB0D4A82975D76257DD8F",
        remoteJid: "203804821733504@lid",
        fromMe: true,
        status: "SERVER_ACK",
        instanceId: "2b161f3a-4648-474d-b27f-1ac2fbf16060",
      },
    });

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith(
      expect.objectContaining({
        providerMessageId: "3EB0D4A82975D76257DD8F",
        status: "SENT",
        errorMessage: null,
      }),
    );
  });

  it("deve mapear ERROR para FAILED", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({
      event: "messages.update",
      data: {
        key: { id: "msg-2" },
        update: { status: "ERROR" },
      },
    });

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith(
      expect.objectContaining({
        providerMessageId: "msg-2",
        status: "FAILED",
        errorMessage: "ERROR",
      }),
    );
  });

  it("deve usar message do payload em FAILED quando existir", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({
      event: "messages.update",
      data: {
        key: { id: "msg-err" },
        update: { status: "ERROR", message: "Falha na rede" },
      },
    });

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "FAILED",
        errorMessage: "Falha na rede",
      }),
    );
  });

  it("deve gravar deliveredAt em DELIVERY_ACK", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({
      event: "messages.update",
      data: {
        key: { id: "msg-del" },
        update: { status: "DELIVERY_ACK" },
      },
    });

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "DELIVERED",
        deliveredAt: expect.any(String),
        errorMessage: null,
      }),
    );
  });

  it("deve gravar readAt em READ", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ProcessWhatsAppWebhookUseCase(repo);

    await sut.execute({
      event: "messages.update",
      data: {
        key: { id: "msg-read" },
        update: { status: "READ" },
      },
    });

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "READ",
        readAt: expect.any(String),
        errorMessage: null,
      }),
    );
  });
});
