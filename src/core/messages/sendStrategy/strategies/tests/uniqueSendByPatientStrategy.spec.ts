import { createMockWhatsAppMessageLogRepository } from "../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT } from "../../sendStrategyKind";
import { UniqueSendByPatientStrategy } from "../uniqueSendByPatientStrategy";

describe("UniqueSendByPatientStrategy", () => {
  const ctx = {
    userId: "user-1",
    patientId: "patient-1",
    campaignId: "camp-1",
  };

  it("deve permitir envio quando não existir log para userId, patientId e campanha", async () => {
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    whatsAppMessageLogRepository.listByUserId.mockResolvedValue({
      items: [],
      total: 0,
    });

    const sut = new UniqueSendByPatientStrategy(whatsAppMessageLogRepository);

    const ok = await sut.allowsSend(ctx);

    expect(ok).toBe(true);
    expect(whatsAppMessageLogRepository.listByUserId).toHaveBeenCalledWith({
      userId: "user-1",
      patientId: "patient-1",
      scheduleMessageConfigId: "camp-1",
      limit: 1,
      offset: 0,
    });
  });

  it("deve negar envio quando já existir ao menos um log para userId, patientId e campanha", async () => {
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    whatsAppMessageLogRepository.listByUserId.mockResolvedValue({
      items: [
        {
          id: "log-1",
          userId: "user-1",
          patientId: "patient-1",
          schedulingId: "sched-1",
          scheduleMessageType: "beforeSchedule",
          scheduleMessageConfigId: "camp-1",
          message: "x",
          toPhone: "5511",
          instanceName: "i",
          status: "PENDING",
          providerMessageId: null,
          errorMessage: null,
          sentAt: null,
          deliveredAt: null,
          readAt: null,
          createdAt: "",
          updatedAt: "",
        },
      ],
      total: 1,
    });

    const sut = new UniqueSendByPatientStrategy(whatsAppMessageLogRepository);

    const ok = await sut.allowsSend(ctx);

    expect(ok).toBe(false);
    expect(whatsAppMessageLogRepository.listByUserId).toHaveBeenCalledWith({
      userId: "user-1",
      patientId: "patient-1",
      scheduleMessageConfigId: "camp-1",
      limit: 1,
      offset: 0,
    });
  });

  it("deve negar envio quando campaignId não estiver no contexto", async () => {
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();

    const sut = new UniqueSendByPatientStrategy(whatsAppMessageLogRepository);

    const ok = await sut.allowsSend({
      userId: "user-1",
      patientId: "patient-1",
    });

    expect(ok).toBe(false);
    expect(whatsAppMessageLogRepository.listByUserId).not.toHaveBeenCalled();
  });

  it("deve expor kind unique_send_by_patient", () => {
    const sut = new UniqueSendByPatientStrategy(
      createMockWhatsAppMessageLogRepository(),
    );

    expect(sut.kind).toBe(SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT);
  });
});
