import { createMockSchedulingRepository } from "../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { SendMostFrequencyPatientsStrategy } from "../sendMostFrequencyPatientsStrategy";

describe("SendMostFrequencyPatientsStrategy", () => {
  it("deve permitir paciente dentro do top N por contagem de agendamentos", async () => {
    const schedulingRepository = createMockSchedulingRepository();
    schedulingRepository.listPatientIdsByUserIdOrderBySchedulingCountDesc.mockResolvedValue(
      ["p-top", "p-second"],
    );

    const sut = new SendMostFrequencyPatientsStrategy(2, schedulingRepository);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-top" });

    expect(ok).toBe(true);
    expect(
      schedulingRepository.listPatientIdsByUserIdOrderBySchedulingCountDesc,
    ).toHaveBeenCalledWith("u-1", 2);
  });

  it("deve negar paciente fora do top N", async () => {
    const schedulingRepository = createMockSchedulingRepository();
    schedulingRepository.listPatientIdsByUserIdOrderBySchedulingCountDesc.mockResolvedValue(
      ["p-1"],
    );

    const sut = new SendMostFrequencyPatientsStrategy(1, schedulingRepository);

    const ok = await sut.allowsSend({ userId: "u-1", patientId: "p-other" });

    expect(ok).toBe(false);
  });
});
