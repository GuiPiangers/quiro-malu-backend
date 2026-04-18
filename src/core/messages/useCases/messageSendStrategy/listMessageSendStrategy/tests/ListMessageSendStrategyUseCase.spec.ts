import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ListMessageSendStrategyUseCase } from "../ListMessageSendStrategyUseCase";

describe("ListMessageSendStrategyUseCase", () => {
  it("deve retornar todas as estratégias do usuário ordenadas pelo repositório", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.listByUserId.mockResolvedValue([
      {
        id: "s-2",
        userId: "user-1",
        kind: "send_most_recent_patients",
        params: { amount: 5 },
      },
      {
        id: "s-1",
        userId: "user-1",
        kind: "send_most_recent_patients",
        params: { amount: 10 },
      },
    ]);

    const sut = new ListMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1" });

    expect(repo.listByUserId).toHaveBeenCalledWith("user-1");
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("s-2");
    expect(result[1].params.amount).toBe(10);
  });

  it("deve retornar lista vazia quando não há estratégias", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.listByUserId.mockResolvedValue([]);

    const sut = new ListMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1" });

    expect(result).toEqual([]);
  });
});
