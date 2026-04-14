import { createMockWhatsAppMessageLogRepository } from "../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { ListWhatsAppMessageLogsUseCase } from "../ListWhatsAppMessageLogsUseCase";

describe("ListWhatsAppMessageLogsUseCase", () => {
  it("deve listar com paginação padrão", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    repo.listByUserId.mockResolvedValue({ items: [], total: 0 });
    const sut = new ListWhatsAppMessageLogsUseCase(repo);

    const res = await sut.execute({ userId: "u1" });

    expect(repo.listByUserId).toHaveBeenCalledWith({
      userId: "u1",
      limit: 20,
      offset: 0,
    });
    expect(res.page).toBe(1);
    expect(res.limit).toBe(20);
    expect(res.total).toBe(0);
  });

  it("deve repassar filtros opcionais", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    repo.listByUserId.mockResolvedValue({ items: [], total: 0 });
    const sut = new ListWhatsAppMessageLogsUseCase(repo);

    await sut.execute({
      userId: "u1",
      page: 2,
      limit: 10,
      patientId: "p1",
      beforeScheduleMessageId: "b1",
      status: "PENDING",
    });

    expect(repo.listByUserId).toHaveBeenCalledWith({
      userId: "u1",
      patientId: "p1",
      beforeScheduleMessageId: "b1",
      status: "PENDING",
      limit: 10,
      offset: 10,
    });
  });

  it("deve rejeitar status inválido", async () => {
    const repo = createMockWhatsAppMessageLogRepository();
    const sut = new ListWhatsAppMessageLogsUseCase(repo);

    await expect(
      sut.execute({ userId: "u1", status: "XYZ" }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
