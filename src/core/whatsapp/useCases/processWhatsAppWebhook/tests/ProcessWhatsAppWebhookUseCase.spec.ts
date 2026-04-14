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

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith({
      providerMessageId: "msg-evolution-1",
      status: "SENT",
      errorMessage: null,
    });
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

    expect(repo.updateByProviderMessageId).toHaveBeenCalledWith({
      providerMessageId: "msg-2",
      status: "FAILED",
      errorMessage: "ERROR",
    });
  });
});
