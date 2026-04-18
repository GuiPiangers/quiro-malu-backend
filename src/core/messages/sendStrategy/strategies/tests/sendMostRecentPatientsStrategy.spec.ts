import { createMockPatientRepository } from "../../../../../repositories/_mocks/PatientRepositoryMock";
import { SendMostRecentPatientsStrategy } from "../sendMostRecentPatientsStrategy";

describe("SendMostRecentPatientsStrategy", () => {
  it("deve permitir paciente dentro do top N por created_at", async () => {
    const patientRepository = createMockPatientRepository();
    patientRepository.getMostRecent.mockResolvedValue([
      { id: "p-new", name: "A", phone: "1" } as any,
      { id: "p-old", name: "B", phone: "2" } as any,
    ]);

    const sut = new SendMostRecentPatientsStrategy(2, patientRepository);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-new" });

    expect(ok).toBe(true);
    expect(patientRepository.getMostRecent).toHaveBeenCalledWith("u-1", 2);
  });

  it("deve negar paciente fora do top N", async () => {
    const patientRepository = createMockPatientRepository();
    patientRepository.getMostRecent.mockResolvedValue([
      { id: "p-1", name: "A", phone: "1" } as any,
    ]);

    const sut = new SendMostRecentPatientsStrategy(1, patientRepository);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-other" });

    expect(ok).toBe(false);
  });
});
