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

  it("should not register and should unschedule when inactive", async () => {
    const scheduler = {
      scheduleOnce: jest.fn(),
      scheduleEvery7Days: jest.fn(),
      unscheduleEvery7Days: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new RegisterMessageCampaignUseCase(scheduler);

    await useCase.execute({
      id: "c1",
      active: false,
      name: "C",
      templateMessage: "T",
      triggers: [],
    } as any);

    expect(scheduler.unscheduleEvery7Days).toHaveBeenCalledWith({ campaignId: "c1" });
    expect(watchTriggersMock).not.toHaveBeenCalled();
  });

  it("should schedule weekly when repeatEveryDays is 7", async () => {
    const scheduler = {
      scheduleOnce: jest.fn(),
      scheduleEvery7Days: jest.fn().mockResolvedValue(undefined),
      unscheduleEvery7Days: jest.fn(),
    } as any;

    const useCase = new RegisterMessageCampaignUseCase(scheduler);

    const startAt = new Date("2026-04-30T20:00:00");

    await useCase.execute({
      id: "c1",
      userId: "u1",
      active: true,
      name: "C",
      templateMessage: "T",
      triggers: [],
      status: "SCHEDULED",
      scheduledAt: startAt,
      repeatEveryDays: 7,
      audienceType: "MOST_RECENT",
    } as any);

    expect(scheduler.scheduleEvery7Days).toHaveBeenCalledWith({
      campaignId: "c1",
      startAt,
    });
  });

  it("should schedule once when repeatEveryDays is not 7", async () => {
    const scheduler = {
      scheduleOnce: jest.fn().mockResolvedValue(undefined),
      scheduleEvery7Days: jest.fn(),
      unscheduleEvery7Days: jest.fn(),
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

  it("should unschedule weekly when status is not SCHEDULED", async () => {
    const scheduler = {
      scheduleOnce: jest.fn(),
      scheduleEvery7Days: jest.fn(),
      unscheduleEvery7Days: jest.fn().mockResolvedValue(undefined),
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

    expect(scheduler.unscheduleEvery7Days).toHaveBeenCalledWith({ campaignId: "c1" });
  });
});
