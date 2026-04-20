import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../../../../sendStrategy/sendStrategyKind";
import { GetMessageSendStrategyByCampaignIdUseCase } from "../GetMessageSendStrategyByCampaignIdUseCase";

describe("GetMessageSendStrategyByCampaignIdUseCase", () => {
  it("deve retornar a estratégia vinculada à campanha", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategyByUserAndCampaign.mockResolvedValue({
      id: "strat-1",
      userId: "user-1",
      name: "Lista",
      kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
      params: { amount: 10 },
      campaignBindingsCount: 1,
    });

    const sut = new GetMessageSendStrategyByCampaignIdUseCase(repo);
    const result = await sut.execute({
      userId: "user-1",
      campaignId: "camp-uuid",
    });

    expect(repo.findActiveStrategyByUserAndCampaign).toHaveBeenCalledWith(
      "user-1",
      "camp-uuid",
    );
    expect(result.id).toBe("strat-1");
    expect(result.kind).toBe(SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS);
  });

  it("deve lançar 404 quando não houver estratégia vinculada", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategyByUserAndCampaign.mockResolvedValue(null);

    const sut = new GetMessageSendStrategyByCampaignIdUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", campaignId: "camp-x" }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
