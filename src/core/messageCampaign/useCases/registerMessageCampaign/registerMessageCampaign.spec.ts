import { RegisterMessageCampaignUseCase } from "./registerMessageCampaignUseCase";

const watchTriggersMock = jest.fn();

jest.mock("../../models/MessageCampaign", () => ({
  MessageCampaign: jest.fn().mockImplementation(() => ({
    watchTriggers: watchTriggersMock,
  })),
}));

describe("RegisterMessageCampaignUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when inactive", async () => {
    const scheduler = {
      scheduleOnce: jest.fn(),
    } as any;

    const useCase = new RegisterMessageCampaignUseCase(scheduler);

    await useCase.execute({
      id: "c1",
      active: false,
      name: "C",
      templateMessage: "T",
      triggers: [],
    } as any);

    expect(scheduler.scheduleOnce).not.toHaveBeenCalled();
    expect(watchTriggersMock).not.toHaveBeenCalled();
  });

  it("should schedule once when status is SCHEDULED and scheduledAt exists", async () => {
    const scheduler = {
      scheduleOnce: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new RegisterMessageCampaignUseCase(scheduler);

    const scheduledAt = new Date("2026-04-30T20:00:00");

    await useCase.execute({
      id: "c1",
      userId: "u1",
      active: true,
      name: "C",
      templateMessage: "T",
      triggers: [],
      status: "SCHEDULED",
      scheduledAt,
      audienceType: "MOST_RECENT",
    } as any);

    expect(scheduler.scheduleOnce).toHaveBeenCalledWith({
      campaignId: "c1",
      scheduledAt,
    });
  });

  it("should not schedule when status is not SCHEDULED", async () => {
    const scheduler = {
      scheduleOnce: jest.fn(),
    } as any;

    const useCase = new RegisterMessageCampaignUseCase(scheduler);

    await useCase.execute({
      id: "c1",
      userId: "u1",
      active: true,
      name: "C",
      templateMessage: "T",
      triggers: [],
      status: "DRAFT",
    } as any);

    expect(scheduler.scheduleOnce).not.toHaveBeenCalled();
  });
});
