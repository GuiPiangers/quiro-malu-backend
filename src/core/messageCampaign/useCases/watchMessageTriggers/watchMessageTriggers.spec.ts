import { createMockMessageCampaignRepository } from "../../../../repositories/_mocks/MessageCampaignRepositoryMock";
import { WatchMessageTriggersUseCase } from "./watchMessageTriggersUseCase";

describe("WatchMessageTriggersUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not register duplicate campaigns", async () => {
    const repository = createMockMessageCampaignRepository();

    repository.listAll.mockResolvedValue([
      {
        id: "campaign-1",
        name: "Campaign 1",
        templateMessage: "Hello",
        active: true,
        triggers: [],
      },
      {
        id: "campaign-2",
        name: "Campaign 2",
        templateMessage: "Hello",
        active: true,
        triggers: [],
      },
    ] as any);

    const registerMessageCampaignUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new WatchMessageTriggersUseCase(
      repository,
      registerMessageCampaignUseCase,
    );

    await useCase.execute();
    await useCase.execute();

    expect(registerMessageCampaignUseCase.execute).toHaveBeenCalledTimes(2);
  });

  it("should register new campaigns that appear later", async () => {
    const repository = createMockMessageCampaignRepository();

    repository.listAll
      .mockResolvedValueOnce([
        {
          id: "campaign-1",
          name: "Campaign 1",
          templateMessage: "Hello",
          active: true,
          triggers: [],
        },
      ] as any)
      .mockResolvedValueOnce([
        {
          id: "campaign-1",
          name: "Campaign 1",
          templateMessage: "Hello",
          active: true,
          triggers: [],
        },
        {
          id: "campaign-2",
          name: "Campaign 2",
          templateMessage: "Hello",
          active: true,
          triggers: [],
        },
      ] as any);

    const registerMessageCampaignUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new WatchMessageTriggersUseCase(
      repository,
      registerMessageCampaignUseCase,
    );

    await useCase.execute();
    await useCase.execute();

    expect(registerMessageCampaignUseCase.execute).toHaveBeenCalledTimes(2);
  });
});
