import { CampaignDispatchQueue } from "../CampaignDispatchQueue";

describe("CampaignDispatchQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should forward jobs to DispatchMessageCampaignUseCase", async () => {
    const dispatchMessageCampaignUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as any;

    const queueProvider = {
      repeat: jest.fn(),
      deleteRepeat: jest.fn(),
      add: jest.fn(),
      delete: jest.fn(),
      process: jest.fn(async (cb: any) => {
        await cb({ campaignId: "c1" });
      }),
    } as any;

    const queue = new CampaignDispatchQueue(
      queueProvider,
      dispatchMessageCampaignUseCase,
    );

    await queue.process();

    expect(dispatchMessageCampaignUseCase.execute).toHaveBeenCalledWith({
      campaignId: "c1",
    });
  });

  it("should schedule a one-time dispatch", async () => {
    const dispatchMessageCampaignUseCase = { execute: jest.fn() } as any;

    const queueProvider = {
      repeat: jest.fn().mockResolvedValue(undefined),
      deleteRepeat: jest.fn(),
      add: jest.fn(),
      delete: jest.fn(),
      process: jest.fn(),
    } as any;

    const queue = new CampaignDispatchQueue(
      queueProvider,
      dispatchMessageCampaignUseCase,
    );

    const scheduledAt = new Date("2026-04-30T20:00:00");

    await queue.scheduleOnce({ campaignId: "c1", scheduledAt });

    const expectedCron =
      "0 " + scheduledAt.getMinutes() + " " + scheduledAt.getHours() + " * * *";

    expect(queueProvider.repeat).toHaveBeenCalledWith(
      { campaignId: "c1" },
      expect.objectContaining({
        jobId: "campaign:c1:once:" + scheduledAt.getTime(),
        cron: expectedCron,
        startDate: scheduledAt,
        limit: 1,
      }),
    );
  });
});
