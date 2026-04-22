import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import {
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
} from "../../../../sendStrategy/sendStrategyKind";
import {
  type CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyUseCase,
} from "../CreateMessageSendStrategyUseCase";

function createSut(
  repo: ReturnType<typeof createMockMessageSendStrategyRepository>,
  patientRepo: ReturnType<typeof createMockPatientRepository>,
) {
  return new CreateMessageSendStrategyUseCase(repo, patientRepo);
}

describe("CreateMessageSendStrategyUseCase", () => {
  it("deve persistir estratégia send_most_recent_patients com amount válido", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const sut = createSut(repo, patientRepo);

    const result = await sut.execute({
      userId: "user-1",
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "  Últimos pacientes  ",
      params: {
        amount: 20,
      },
    });

    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Últimos pacientes",
        kind: "send_most_recent_patients",
        params: { amount: 20 },
      }),
    );
    expect(result.name).toBe("Últimos pacientes");
    expect((result.params as { amount: number }).amount).toBe(20);
    expect(result.campaignBindingsCount).toBe(0);
    expect(result.id).toBeDefined();
    expect(patientRepo.countPatientsOwnedByUser).not.toHaveBeenCalled();
  });

  it("deve persistir estratégia send_most_frequency_patients com amount válido", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const sut = createSut(repo, patientRepo);

    const result = await sut.execute({
      userId: "user-1",
      kind: SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
      name: "Mais agendamentos",
      params: {
        amount: 15,
      },
    });

    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Mais agendamentos",
        kind: SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
        params: { amount: 15 },
      }),
    );
    expect(result.kind).toBe(SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS);
    expect((result.params as { amount: number }).amount).toBe(15);
  });

  it("deve persistir send_selected_list quando todos os pacientes pertencem ao usuário", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    patientRepo.countPatientsOwnedByUser.mockResolvedValue(2);
    const sut = createSut(repo, patientRepo);

    const patientIdList = ["p-1", "p-2"];
    const result = await sut.execute({
      userId: "user-1",
      kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
      name: "Lista VIP",
      params: { patientIdList },
    });

    expect(patientRepo.countPatientsOwnedByUser).toHaveBeenCalledWith({
      userId: "user-1",
      patientIds: patientIdList,
    });
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Lista VIP",
        kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
        params: { patientIdList },
      }),
    );
    expect(result.kind).toBe(SEND_STRATEGY_KIND_SEND_SELECTED_LIST);
    expect((result.params as { patientIdList: string[] }).patientIdList).toEqual(
      patientIdList,
    );
  });

  it("deve rejeitar send_selected_list quando algum paciente não pertence ao usuário", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    patientRepo.countPatientsOwnedByUser.mockResolvedValue(1);
    const sut = createSut(repo, patientRepo);

    await expect(
      sut.execute({
        userId: "user-1",
        kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
        name: "Lista",
        params: { patientIdList: ["p-1", "p-2"] },
      }),
    ).rejects.toThrow(ApiError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("deve rejeitar name vazio ou só espaços", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const sut = createSut(repo, patientRepo);

    await expect(
      sut.execute({
        userId: "user-1",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        name: "   ",
        params: { amount: 10 },
      }),
    ).rejects.toThrow(ApiError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("deve rejeitar amount fora do intervalo 1–50", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const sut = createSut(repo, patientRepo);

    await expect(
      sut.execute({
        userId: "user-1",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        name: "Estratégia",
        params: { amount: 0 },
      }),
    ).rejects.toThrow(ApiError);
    await expect(
      sut.execute({
        userId: "user-1",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        name: "Estratégia",
        params: { amount: 51 },
      }),
    ).rejects.toThrow(ApiError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("deve retornar 501 para kinds ainda não implementados", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const patientRepo = createMockPatientRepository();
    const sut = createSut(repo, patientRepo);

    await expect(
      sut.execute({
        userId: "user-1",
        kind: "exclude_patients_list",
        name: "Qualquer",
        params: {},
      } as unknown as CreateMessageSendStrategyDTO),
    ).rejects.toMatchObject({ statusCode: 501 });

    expect(repo.save).not.toHaveBeenCalled();
  });
});
