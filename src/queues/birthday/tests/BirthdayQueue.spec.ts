import { DateTime } from "../../../core/shared/Date";
import { BirthdayQueue } from "../BirthdayQueue";

describe("BirthdayQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not schedule when config does not exist", async () => {
    const queueProvider = { repeat: jest.fn(), process: jest.fn() } as any;
    const configRepository = { get: jest.fn().mockResolvedValue(null) } as any;

    const queue = new BirthdayQueue(
      queueProvider,
      configRepository,
      { getById: jest.fn() } as any,
      { getByDateOfBirth: jest.fn() } as any,
      { add: jest.fn() } as any,
    );

    await queue.schedule();

    expect(queueProvider.repeat).not.toHaveBeenCalled();
  });

  it("should generate cron pattern from sendHour/sendMinute", async () => {
    const queueProvider = { repeat: jest.fn(), process: jest.fn() } as any;

    const configRepository = {
      get: jest.fn().mockResolvedValue({
        campaignId: "campaign-1",
        sendHour: 9,
        sendMinute: 30,
      }),
    } as any;

    const queue = new BirthdayQueue(
      queueProvider,
      configRepository,
      { getById: jest.fn() } as any,
      { getByDateOfBirth: jest.fn() } as any,
      { add: jest.fn() } as any,
    );

    await queue.schedule();

    expect(queueProvider.repeat).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ cron: "0 30 9 * * *" }),
    );
  });

  it("should not enqueue when campaign is inactive", async () => {
    const queueProvider = {
      repeat: jest.fn(),
      process: jest.fn(async (cb: any) => cb({})),
    } as any;

    const configRepository = {
      get: jest.fn().mockResolvedValue({
        campaignId: "campaign-1",
        sendHour: 9,
        sendMinute: 0,
      }),
    } as any;

    const messageCampaignRepository = {
      getById: jest.fn().mockResolvedValue({
        id: "campaign-1",
        userId: "user-1",
        active: false,
      }),
    } as any;

    const sendMessageQueue = { add: jest.fn() } as any;

    const queue = new BirthdayQueue(
      queueProvider,
      configRepository,
      messageCampaignRepository,
      { getByDateOfBirth: jest.fn() } as any,
      sendMessageQueue,
    );

    await queue.process();

    expect(sendMessageQueue.add).not.toHaveBeenCalled();
  });

  it("should enqueue one job per patient when campaign is active", async () => {
    const queueProvider = {
      repeat: jest.fn(),
      process: jest.fn(async (cb: any) => cb({})),
    } as any;

    const configRepository = {
      get: jest.fn().mockResolvedValue({
        campaignId: "campaign-1",
        sendHour: 9,
        sendMinute: 0,
      }),
    } as any;

    const messageCampaignRepository = {
      getById: jest.fn().mockResolvedValue({
        id: "campaign-1",
        userId: "user-1",
        active: true,
        triggers: [],
        templateMessage: "Hi",
        name: "Campaign",
      }),
    } as any;

    const patientRepository = {
      getByDateOfBirth: jest.fn().mockResolvedValue([
        { id: "p1", userId: "user-1" },
        { id: "p2", userId: "user-1" },
      ]),
    } as any;

    const sendMessageQueue = { add: jest.fn().mockResolvedValue(undefined) } as any;

    jest.spyOn(DateTime, "now").mockReturnValue(new DateTime("2026-01-01T10:00"));

    const queue = new BirthdayQueue(
      queueProvider,
      configRepository,
      messageCampaignRepository,
      patientRepository,
      sendMessageQueue,
    );

    await queue.process();

    expect(patientRepository.getByDateOfBirth).toHaveBeenCalledWith({
      dateOfBirth: "2026-01-01",
    });

    expect(sendMessageQueue.add).toHaveBeenCalledTimes(2);
    expect(sendMessageQueue.add).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: "BIRTHDAY",
        userId: "user-1",
      }),
    );
  });
});
