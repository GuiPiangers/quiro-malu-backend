import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../../../sendStrategy/sendStrategyKind";
import { UpdateMessageSendStrategyUseCase } from "../UpdateMessageSendStrategyUseCase";

const existingRow = {
  id: "s-1",
  userId: "user-1",
  name: "Antigo",
  kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  params: { amount: 10 },
  campaignBindingsCount: 1,
};

describe("UpdateMessageSendStrategyUseCase", () => {
  it("deve atualizar apenas o name quando informado", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId
      .mockResolvedValueOnce({ ...existingRow })
      .mockResolvedValueOnce({ ...existingRow, name: "Novo nome" });

    const sut = new UpdateMessageSendStrategyUseCase(repo);
    const result = await sut.execute({
      userId: "user-1",
      strategyId: "s-1",
      name: "  Novo nome  ",
    });

    expect(repo.updateByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1", {
      name: "Novo nome",
    });
    expect(result.name).toBe("Novo nome");
    expect(result.params).toEqual({ amount: 10 });
  });

  it("atualiza kind, name (raiz) e params com amount no objeto params", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId
      .mockResolvedValueOnce({ ...existingRow })
      .mockResolvedValueOnce({
        ...existingRow,
        name: "Tesserfsed",
        params: { amount: 30 },
      });

    const sut = new UpdateMessageSendStrategyUseCase(repo);
    await sut.execute({
      userId: "user-1",
      strategyId: "s-1",
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "Tesserfsed",
      params: { amount: 30 },
    });

    expect(repo.updateByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1", {
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "Tesserfsed",
      params: { amount: 30 },
    });
  });

  it("deve substituir kind, name e params quando kind e params forem enviados juntos", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId
      .mockResolvedValueOnce({ ...existingRow })
      .mockResolvedValueOnce({
        ...existingRow,
        name: "Campanha X",
        params: { amount: 25 },
      });

    const sut = new UpdateMessageSendStrategyUseCase(repo);
    const result = await sut.execute({
      userId: "user-1",
      strategyId: "s-1",
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "Campanha X",
      params: { amount: 25 },
    });

    expect(repo.updateByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1", {
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "Campanha X",
      params: { amount: 25 },
    });
    expect(result.params).toEqual({ amount: 25 });
    expect(result.name).toBe("Campanha X");
  });

  it("não deve mesclar params antigos ao atualizar com kind e params", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId
      .mockResolvedValueOnce({
        ...existingRow,
        params: { amount: 10, legacy: "x" },
      })
      .mockResolvedValueOnce({
        ...existingRow,
        params: { amount: 20 },
      });

    const sut = new UpdateMessageSendStrategyUseCase(repo);
    await sut.execute({
      userId: "user-1",
      strategyId: "s-1",
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "N",
      params: { amount: 20 },
    });

    expect(repo.updateByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1", {
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      name: "N",
      params: { amount: 20 },
    });
  });

  it("deve exigir params quando kind for informado", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...existingRow });

    const sut = new UpdateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        strategyId: "s-1",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      } as any),
    ).rejects.toThrow(ApiError);
    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
  });

  it("deve exigir kind quando params for informado", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...existingRow });

    const sut = new UpdateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        strategyId: "s-1",
        params: { amount: 5 },
      } as any),
    ).rejects.toThrow(ApiError);
    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
  });

  it("não deve chamar update quando não há campos para alterar", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...existingRow });

    const sut = new UpdateMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1", strategyId: "s-1" });

    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "s-1",
      userId: "user-1",
      name: "Antigo",
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      params: { amount: 10 },
      campaignBindingsCount: 1,
    });
  });

  it("deve lançar 404 quando a estratégia não existe", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue(null);

    const sut = new UpdateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", strategyId: "s-x", name: "X" }),
    ).rejects.toThrow(ApiError);
    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
  });

  it("deve rejeitar name vazio", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...existingRow });

    const sut = new UpdateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", strategyId: "s-1", name: "   " }),
    ).rejects.toThrow(ApiError);
    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
  });

  it("deve rejeitar name vazio ao atualizar com kind e params (nome só no raiz)", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...existingRow });

    const sut = new UpdateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        strategyId: "s-1",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 10 },
      } as any),
    ).rejects.toThrow(ApiError);
    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
  });

  it("deve rejeitar amount fora do intervalo ao atualizar com kind e params", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...existingRow });

    const sut = new UpdateMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        strategyId: "s-1",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        name: "Ok",
        params: { amount: 0 },
      }),
    ).rejects.toThrow(ApiError);
    expect(repo.updateByIdAndUserId).not.toHaveBeenCalled();
  });
});
