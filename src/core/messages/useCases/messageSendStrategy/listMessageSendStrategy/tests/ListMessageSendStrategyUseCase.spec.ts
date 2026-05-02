import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { UNIQUE_USER_STRATEGY_ID } from "../../../../sendStrategy/sendStrategyKind";
import { ListMessageSendStrategyUseCase } from "../ListMessageSendStrategyUseCase";

const virtualRow = {
  id: UNIQUE_USER_STRATEGY_ID,
  userId: "user-1",
  name: "Único por paciente",
  kind: "unique_send_by_patient" as const,
  params: {},
  campaignBindingsCount: 7,
};

describe("ListMessageSendStrategyUseCase", () => {
  it("deve retornar estratégias paginadas do usuário (padrão page 1, limit 20) incluindo unique_send_by_patient", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue(virtualRow);
    repo.listByUserIdPaged
      .mockResolvedValueOnce({ items: [], total: 12 })
      .mockResolvedValueOnce({
        items: [
          {
            id: "s-2",
            userId: "user-1",
            name: "Campanha A",
            kind: "send_most_recent_patients",
            params: { amount: 5 },
            campaignBindingsCount: 2,
          },
          {
            id: "s-1",
            userId: "user-1",
            name: "Campanha B",
            kind: "send_most_recent_patients",
            params: { amount: 10 },
            campaignBindingsCount: 0,
          },
        ],
        total: 12,
      });

    const sut = new ListMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1" });

    expect(repo.findByIdAndUserId).toHaveBeenCalledWith(
      UNIQUE_USER_STRATEGY_ID,
      "user-1",
    );
    expect(repo.listByUserIdPaged).toHaveBeenNthCalledWith(1, {
      userId: "user-1",
      limit: 0,
      offset: 0,
    });
    expect(repo.listByUserIdPaged).toHaveBeenNthCalledWith(2, {
      userId: "user-1",
      limit: 12,
      offset: 0,
    });
    expect(result).toEqual({
      items: [
        expect.objectContaining({
          id: UNIQUE_USER_STRATEGY_ID,
          name: "Único por paciente",
          kind: "unique_send_by_patient",
          params: {},
          campaignBindingsCount: 7,
        }),
        expect.objectContaining({
          id: "s-2",
          name: "Campanha A",
          params: { amount: 5 },
          campaignBindingsCount: 2,
        }),
        expect.objectContaining({
          id: "s-1",
          name: "Campanha B",
          params: { amount: 10 },
          campaignBindingsCount: 0,
        }),
      ],
      total: 13,
      page: 1,
      limit: 20,
    });
    expect(result.items).toHaveLength(3);
  });

  it("deve aplicar page e limit e limitar máximo a 100", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...virtualRow, campaignBindingsCount: 0 });
    repo.listByUserIdPaged
      .mockResolvedValueOnce({ items: [], total: 200 })
      .mockResolvedValueOnce({ items: [], total: 200 });

    const sut = new ListMessageSendStrategyUseCase(repo);
    await sut.execute({ userId: "user-1", page: 2, limit: 500 });

    expect(repo.listByUserIdPaged).toHaveBeenNthCalledWith(1, {
      userId: "user-1",
      limit: 0,
      offset: 0,
    });
    expect(repo.listByUserIdPaged).toHaveBeenNthCalledWith(2, {
      userId: "user-1",
      limit: 100,
      offset: 99,
    });
  });

  it("deve retornar apenas a estratégia virtual unique quando não há estratégias persistidas", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({ ...virtualRow, campaignBindingsCount: 0 });
    repo.listByUserIdPaged
      .mockResolvedValueOnce({ items: [], total: 0 })
      .mockResolvedValueOnce({ items: [], total: 0 });

    const sut = new ListMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(
      expect.objectContaining({
        id: UNIQUE_USER_STRATEGY_ID,
        kind: "unique_send_by_patient",
      }),
    );
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});
