import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { BindMessageSendStrategyCampaignsUseCase } from "../BindMessageSendStrategyCampaignsUseCase";

describe("BindMessageSendStrategyCampaignsUseCase", () => {
  const strategyRow = (id: string) => ({
    id,
    userId: "user-1",
    name: `Estratégia ${id}`,
    kind: "send_most_recent_patients",
    params: { amount: 10 },
    campaignBindingsCount: 0,
  });

  it("deve validar cada estratégia e persistir todos os vínculos da campanha em uma única operação", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockImplementation(async (id: string) =>
      ["s-1", "s-2", "s-3"].includes(id) ? strategyRow(id) : null,
    );

    const sut = new BindMessageSendStrategyCampaignsUseCase(repo);

    await sut.execute({
      userId: "user-1",
      campaignId: "camp-1",
      strategyIds: ["s-1", "s-2", "s-3"],
    });

    expect(repo.findByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1");
    expect(repo.findByIdAndUserId).toHaveBeenCalledWith("s-2", "user-1");
    expect(repo.findByIdAndUserId).toHaveBeenCalledWith("s-3", "user-1");
    expect(repo.setCampaignStrategyBindings).toHaveBeenCalledWith(
      "user-1",
      "camp-1",
      ["s-1", "s-2", "s-3"],
    );
    expect(repo.setCampaignStrategyBindings).toHaveBeenCalledTimes(1);
  });

  it("deve deduplicar strategyIds antes de persistir", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockImplementation(async (id: string) =>
      id === "s-1" || id === "s-2" ? strategyRow(id) : null,
    );

    const sut = new BindMessageSendStrategyCampaignsUseCase(repo);

    await sut.execute({
      userId: "user-1",
      campaignId: "camp-1",
      strategyIds: ["s-1", "s-2", "s-1"],
    });

    expect(repo.setCampaignStrategyBindings).toHaveBeenCalledWith(
      "user-1",
      "camp-1",
      ["s-1", "s-2"],
    );
  });

  it("deve lançar 400 quando strategyIds estiver vazio", async () => {
    const repo = createMockMessageSendStrategyRepository();

    const sut = new BindMessageSendStrategyCampaignsUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        campaignId: "camp-1",
        strategyIds: [],
      }),
    ).rejects.toMatchObject({
      message: "strategyIds deve ter ao menos um item",
      statusCode: 400,
    });

    expect(repo.setCampaignStrategyBindings).not.toHaveBeenCalled();
  });

  it("deve lançar 404 quando alguma estratégia não pertence ao usuário", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockImplementation(async (id: string) =>
      id === "s-1" ? strategyRow("s-1") : null,
    );

    const sut = new BindMessageSendStrategyCampaignsUseCase(repo);

    await expect(
      sut.execute({
        userId: "user-1",
        campaignId: "camp-1",
        strategyIds: ["s-1", "s-inexistente"],
      }),
    ).rejects.toThrow(ApiError);

    expect(repo.setCampaignStrategyBindings).not.toHaveBeenCalled();
  });
});
