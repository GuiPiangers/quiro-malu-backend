import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockWhatsAppMessageLogRepository } from "../../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { ListWhatsAppMessageLogsUseCase } from "../../listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsByPatientUseCase } from "../ListWhatsAppMessageLogsByPatientUseCase";

describe("ListWhatsAppMessageLogsByPatientUseCase", () => {
  it("deve lançar 404 quando paciente não existe", async () => {
    const patientRepo = createMockPatientRepository();
    patientRepo.getById.mockResolvedValue([null as any]);

    const logRepo = createMockWhatsAppMessageLogRepository();
    const listLogs = new ListWhatsAppMessageLogsUseCase(logRepo);

    const sut = new ListWhatsAppMessageLogsByPatientUseCase(patientRepo, listLogs);

    await expect(
      sut.execute({ userId: "u1", patientId: "p1" }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("deve delegar para listagem quando paciente existe", async () => {
    const patientRepo = createMockPatientRepository();
    patientRepo.getById.mockResolvedValue([{ id: "p1" } as any]);

    const logRepo = createMockWhatsAppMessageLogRepository();
    logRepo.listByUserId.mockResolvedValue({ items: [], total: 0 });
    const listLogs = new ListWhatsAppMessageLogsUseCase(logRepo);

    const sut = new ListWhatsAppMessageLogsByPatientUseCase(patientRepo, listLogs);

    await sut.execute({ userId: "u1", patientId: "p1", page: 2, limit: 5 });

    expect(logRepo.listByUserId).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "u1",
        patientId: "p1",
        offset: 5,
        limit: 5,
      }),
    );
  });
});
