import { createMockWhatsAppMessageLogRepository } from "../../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { ListWhatsAppMessageLogsUseCase } from "../../listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";
import { ListWhatsAppMessageLogsByPatientUseCase } from "../ListWhatsAppMessageLogsByPatientUseCase";

describe("ListWhatsAppMessageLogsByPatientUseCase", () => {
  it("deve retornar 404 quando paciente não existe", async () => {
    const patientRepo = createMockPatientRepository();
    patientRepo.getById.mockResolvedValue([]);
    const logRepo = createMockWhatsAppMessageLogRepository();
    const listLogs = new ListWhatsAppMessageLogsUseCase(logRepo);
    const sut = new ListWhatsAppMessageLogsByPatientUseCase(
      patientRepo,
      listLogs,
    );

    await expect(
      sut.execute({ userId: "u1", patientId: "missing" }),
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(logRepo.listByUserId).not.toHaveBeenCalled();
  });

  it("deve listar logs quando paciente existe", async () => {
    const patientRepo = createMockPatientRepository();
    patientRepo.getById.mockResolvedValue([{ id: "p1" } as any]);
    const logRepo = createMockWhatsAppMessageLogRepository();
    logRepo.listByUserId.mockResolvedValue({ items: [], total: 0 });
    const listLogs = new ListWhatsAppMessageLogsUseCase(logRepo);
    const sut = new ListWhatsAppMessageLogsByPatientUseCase(
      patientRepo,
      listLogs,
    );

    await sut.execute({ userId: "u1", patientId: "p1" });

    expect(logRepo.listByUserId).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", patientId: "p1" }),
    );
  });
});
