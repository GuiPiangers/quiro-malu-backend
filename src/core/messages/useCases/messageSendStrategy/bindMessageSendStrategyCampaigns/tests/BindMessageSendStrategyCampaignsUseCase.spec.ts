import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { BindMessageSendStrategyCampaignsUseCase } from "../BindMessageSendStrategyCampaignsUseCase";

describe("BindMessageSendStrategyCampaignsUseCase", () => {
  it("deve fazer upsert por campanha quando estratégia existe", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-1",
      userId: "user-1",
      name: "Estratégia 1",
      kind: "send_most_recent_patients",
      params: { amount: 10 },
      campaignBindingsCount: 3,
    });

    const sut = new BindMessageSendStrategyCampaignsUseCase(repo);

    await sut.execute({
      userId: "user-1",
      strategyId: "s-1",
      campaignIds: ["camp-bday-1", "camp-before-1"],
    });

    expect(repo.upsertCampaignBinding).toHaveBeenCalledWith(
      "user-1",
      "camp-bday-1",
      "s-1",
    );
    expect(repo.upsertCampaignBinding).toHaveBeenCalledWith(
      "user-1",
      "camp-before-1",
      "s-1",
    );
  });

  it("deve lançar 404 quando estratégia não pertence ao usuário", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue(null);

    const sut = new BindMessageSendStrategyCampaignsUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        strategyId: "s-x",
        campaignIds: ["camp-1"],
      }),
    ).rejects.toThrow(ApiError);

    expect(repo.upsertCampaignBinding).not.toHaveBeenCalled();
  });
});
