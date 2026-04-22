import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import {
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
} from "../../../../sendStrategy/sendStrategyKind";
import {
  type CreateMessageSendStrategyDTO,
  CreateMessageSendStrategyUseCase,
} from "../CreateMessageSendStrategyUseCase";

describe("CreateMessageSendStrategyUseCase", () => {
  it("deve persistir estratégia send_most_recent_patients com amount válido", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new CreateMessageSendStrategyUseCase(repo);

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
    expect(result.params.amount).toBe(20);
    expect(result.campaignBindingsCount).toBe(0);
    expect(result.id).toBeDefined();
  });

  it("deve persistir estratégia send_most_frequency_patients com amount válido", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new CreateMessageSendStrategyUseCase(repo);

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
    expect(result.params.amount).toBe(15);
  });

  it("deve rejeitar name vazio ou só espaços", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new CreateMessageSendStrategyUseCase(repo);

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
    const sut = new CreateMessageSendStrategyUseCase(repo);

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
    const sut = new CreateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        kind: "send_selected_list",
        name: "Qualquer",
        params: {},
      } as CreateMessageSendStrategyDTO),
    ).rejects.toMatchObject({ statusCode: 501 });

    expect(repo.save).not.toHaveBeenCalled();
  });
});
