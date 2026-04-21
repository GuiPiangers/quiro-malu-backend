import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { UnbindMessageSendStrategyCampaignUseCase } from "../UnbindMessageSendStrategyCampaignUseCase";

describe("UnbindMessageSendStrategyCampaignUseCase", () => {
  it("deve remover o vínculo campanha–estratégia", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new UnbindMessageSendStrategyCampaignUseCase(repo);

    await sut.execute({
      userId: "user-1",
      campaignId: "camp-1",
    });

    expect(repo.deleteCampaignBinding).toHaveBeenCalledWith("user-1", "camp-1");
  });

  it("deve rejeitar campaignId vazio", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new UnbindMessageSendStrategyCampaignUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", campaignId: "   " }),
    ).rejects.toThrow(ApiError);
    expect(repo.deleteCampaignBinding).not.toHaveBeenCalled();
  });
});
