import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { GetMessageSendStrategyUseCase } from "../GetMessageSendStrategyUseCase";

describe("GetMessageSendStrategyUseCase", () => {
  it("deve retornar a estratégia e pacientes mais recentes quando kind é send_most_recent_patients", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const schedulingRepo = createMockSchedulingRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-1",
      userId: "user-1",
      name: "Meu filtro",
      kind: "send_most_recent_patients",
      params: { amount: 10 },
      campaignBindingsCount: 2,
    });
    patientRepo.getMostRecent.mockResolvedValue([
      { name: "Ana", phone: "11999990001", cpf: "111" },
      { name: "Beto", phone: "11999990002" },
    ]);

    const sut = new GetMessageSendStrategyUseCase(
      repo,
      patientRepo,
      schedulingRepo,
    );
    const result = await sut.execute({ userId: "user-1", strategyId: "s-1" });

    expect(repo.findByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1");
    expect(patientRepo.getMostRecent).toHaveBeenCalledWith("user-1", 10);
    expect(patientRepo.listPatientsById).not.toHaveBeenCalled();
    expect(
      schedulingRepo.listPatientIdsByUserIdOrderBySchedulingCountDesc,
    ).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "s-1",
      userId: "user-1",
      name: "Meu filtro",
      kind: "send_most_recent_patients",
      params: { amount: 10 },
      campaignBindingsCount: 2,
      patients: [
        { name: "Ana", phone: "11999990001", cpf: "111" },
        { name: "Beto", phone: "11999990002", cpf: undefined },
      ],
    });
  });

  it("deve retornar pacientes mais frequentes quando kind é send_most_frequency_patients", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const schedulingRepo = createMockSchedulingRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-2",
      userId: "user-1",
      name: "Freq",
      kind: "send_most_frequency_patients",
      params: { amount: 3 },
      campaignBindingsCount: 0,
    });
    schedulingRepo.listPatientIdsByUserIdOrderBySchedulingCountDesc.mockResolvedValue(
      ["p-c"],
    );
    patientRepo.listPatientsById.mockResolvedValue([
      { id: "p-c", name: "Carla", phone: "11999990003", cpf: "222" },
    ]);

    const sut = new GetMessageSendStrategyUseCase(
      repo,
      patientRepo,
      schedulingRepo,
    );
    const result = await sut.execute({ userId: "user-1", strategyId: "s-2" });

    expect(
      schedulingRepo.listPatientIdsByUserIdOrderBySchedulingCountDesc,
    ).toHaveBeenCalledWith("user-1", 3);
    expect(patientRepo.listPatientsById).toHaveBeenCalledWith({
      userId: "user-1",
      patientIds: ["p-c"],
    });
    expect(patientRepo.getMostRecent).not.toHaveBeenCalled();
    expect(result.patients).toEqual([
      { name: "Carla", phone: "11999990003", cpf: "222" },
    ]);
  });

  it("deve retornar lista vazia de pacientes quando não há agendamentos para frequência", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const schedulingRepo = createMockSchedulingRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-2b",
      userId: "user-1",
      name: "Freq vazia",
      kind: "send_most_frequency_patients",
      params: { amount: 5 },
      campaignBindingsCount: 0,
    });
    schedulingRepo.listPatientIdsByUserIdOrderBySchedulingCountDesc.mockResolvedValue(
      [],
    );

    const sut = new GetMessageSendStrategyUseCase(
      repo,
      patientRepo,
      schedulingRepo,
    );
    const result = await sut.execute({ userId: "user-1", strategyId: "s-2b" });

    expect(patientRepo.listPatientsById).not.toHaveBeenCalled();
    expect(result.patients).toEqual([]);
  });

  it("deve listar pacientes por id quando kind é send_selected_list", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const schedulingRepo = createMockSchedulingRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-3",
      userId: "user-1",
      name: "Lista",
      kind: "send_selected_list",
      params: { patientIdList: ["p-2", "p-1"] },
      campaignBindingsCount: 1,
    });
    patientRepo.listPatientsById.mockResolvedValue([
      { id: "p-2", name: "Dois", phone: "11", cpf: "2" },
      { id: "p-1", name: "Um", phone: "22", cpf: "1" },
    ]);

    const sut = new GetMessageSendStrategyUseCase(
      repo,
      patientRepo,
      schedulingRepo,
    );
    const result = await sut.execute({ userId: "user-1", strategyId: "s-3" });

    expect(patientRepo.listPatientsById).toHaveBeenCalledWith({
      userId: "user-1",
      patientIds: ["p-2", "p-1"],
    });
    expect(result.patients).toEqual([
      { name: "Dois", phone: "11", cpf: "2" },
      { name: "Um", phone: "22", cpf: "1" },
    ]);
  });

  it("deve listar pacientes por id quando kind é exclude_patients_list", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const schedulingRepo = createMockSchedulingRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-4",
      userId: "user-1",
      name: "Excluir",
      kind: "exclude_patients_list",
      params: { patientIdList: ["p-9"] },
      campaignBindingsCount: 0,
    });
    patientRepo.listPatientsById.mockResolvedValue([
      { id: "p-9", name: "Nove", phone: "99", cpf: "9" },
    ]);

    const sut = new GetMessageSendStrategyUseCase(
      repo,
      patientRepo,
      schedulingRepo,
    );
    const result = await sut.execute({ userId: "user-1", strategyId: "s-4" });

    expect(patientRepo.listPatientsById).toHaveBeenCalledWith({
      userId: "user-1",
      patientIds: ["p-9"],
    });
    expect(result.patients).toEqual([{ name: "Nove", phone: "99", cpf: "9" }]);
  });

  it("deve lançar 404 quando a estratégia não existe", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const schedulingRepo = createMockSchedulingRepository();
    repo.findByIdAndUserId.mockResolvedValue(null);

    const sut = new GetMessageSendStrategyUseCase(
      repo,
      patientRepo,
      schedulingRepo,
    );

    await expect(
      sut.execute({ userId: "user-1", strategyId: "s-x" }),
    ).rejects.toThrow(ApiError);
  });
});
