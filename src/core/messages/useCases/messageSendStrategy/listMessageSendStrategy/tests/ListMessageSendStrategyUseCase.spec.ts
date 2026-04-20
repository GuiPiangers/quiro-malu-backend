import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ListMessageSendStrategyUseCase } from "../ListMessageSendStrategyUseCase";

describe("ListMessageSendStrategyUseCase", () => {
  it("deve retornar estratégias paginadas do usuário (padrão page 1, limit 20)", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.listByUserIdPaged.mockResolvedValue({
      items: [
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
      ],
      total: 12,
    });

    const sut = new ListMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1" });

    expect(repo.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 20,
      offset: 0,
    });
    expect(result).toEqual({
      items: [
        expect.objectContaining({ id: "s-2", params: { amount: 5 } }),
        expect.objectContaining({ id: "s-1", params: { amount: 10 } }),
      ],
      total: 12,
      page: 1,
      limit: 20,
    });
    expect(result.items).toHaveLength(2);
  });

  it("deve aplicar page e limit e limitar máximo a 100", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.listByUserIdPaged.mockResolvedValue({ items: [], total: 200 });

    const sut = new ListMessageSendStrategyUseCase(repo);
    await sut.execute({ userId: "user-1", page: 2, limit: 500 });

    expect(repo.listByUserIdPaged).toHaveBeenCalledWith({
      userId: "user-1",
      limit: 100,
      offset: 100,
    });
  });

  it("deve retornar lista vazia quando não há estratégias", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.listByUserIdPaged.mockResolvedValue({ items: [], total: 0 });

    const sut = new ListMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1" });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});
