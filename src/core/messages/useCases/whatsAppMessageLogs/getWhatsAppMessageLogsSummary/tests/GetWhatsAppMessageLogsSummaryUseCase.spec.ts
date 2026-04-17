import { createMockWhatsAppMessageLogRepository } from "../../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { GetWhatsAppMessageLogsSummaryUseCase } from "../GetWhatsAppMessageLogsSummaryUseCase";

describe("GetWhatsAppMessageLogsSummaryUseCase", () => {
  it("deve repassar filtros ao repositório", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    repo.summaryByUserId.mockResolvedValue({
      total: 0,
      byStatus: {
        PENDING: 0,
        SENT: 0,
        DELIVERED: 0,
        READ: 0,
        FAILED: 0,
      },
      deliveryRate: null,
      readRate: null,
    });

    const sut = new GetWhatsAppMessageLogsSummaryUseCase(repo);

    await sut.execute({
      userId: "u1",
      patientId: "p1",
      scheduleMessageType: "afterSchedule",
      scheduleMessageConfigId: "cfg-1",
    });

    expect(repo.summaryByUserId).toHaveBeenCalledWith("u1", {
      patientId: "p1",
      scheduleMessageType: "afterSchedule",
      scheduleMessageConfigId: "cfg-1",
    });
  });
});
