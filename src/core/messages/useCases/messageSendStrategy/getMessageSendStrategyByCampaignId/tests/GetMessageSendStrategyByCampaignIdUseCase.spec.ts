import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../../../sendStrategy/sendStrategyKind";
import { GetMessageSendStrategyByCampaignIdUseCase } from "../GetMessageSendStrategyByCampaignIdUseCase";

describe("GetMessageSendStrategyByCampaignIdUseCase", () => {
  it("deve retornar todas as estratégias vinculadas à campanha", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategiesByUserAndCampaign.mockResolvedValue([
      {
        id: "strat-1",
        userId: "user-1",
        name: "Lista",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 10 },
        campaignBindingsCount: 1,
      },
      {
        id: "strat-2",
        userId: "user-1",
        name: "Outra",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 5 },
        campaignBindingsCount: 1,
      },
    ]);

    const sut = new GetMessageSendStrategyByCampaignIdUseCase(repo);
    const result = await sut.execute({
      userId: "user-1",
      campaignId: "camp-uuid",
    });

    expect(repo.findActiveStrategiesByUserAndCampaign).toHaveBeenCalledWith(
      "user-1",
      "camp-uuid",
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("strat-1");
    expect(result[0].kind).toBe(SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS);
    expect(result[1].id).toBe("strat-2");
  });

  it("deve lançar 404 quando não houver estratégia vinculada", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategiesByUserAndCampaign.mockResolvedValue([]);

    const sut = new GetMessageSendStrategyByCampaignIdUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", campaignId: "camp-x" }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
