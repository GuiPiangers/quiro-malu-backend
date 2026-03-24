import { createMockMessageCampaignRepository } from "../../../../repositories/_mocks/MessageCampaignRepositoryMock";
import { ScheduleMessageCampaignUseCase } from "./scheduleMessageCampaignUseCase";

describe("ScheduleMessageCampaignUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update campaign and register schedule", async () => {
    const repository = createMockMessageCampaignRepository();

    const registerMessageCampaignUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new ScheduleMessageCampaignUseCase(
      repository,
      registerMessageCampaignUseCase,
    );

    const scheduledAt = new Date("2026-04-30T20:00:00");

    repository.getById.mockResolvedValue({
      id: "c1",
      userId: "u1",
      active: true,
      name: "C",
      templateMessage: "T",
      triggers: [],
      status: "SCHEDULED",
      scheduledAt,
      repeatEveryDays: 7,
      audienceType: "MOST_RECENT",
    } as any);

    await useCase.execute({
      campaignId: "c1",
      scheduledAt,
      repeatEveryDays: 7,
    });

    expect(repository.update).toHaveBeenCalledWith("c1", {
      status: "SCHEDULED",
      scheduledAt,
      repeatEveryDays: 7,
    });

    expect(registerMessageCampaignUseCase.execute).toHaveBeenCalled();
  });
});
