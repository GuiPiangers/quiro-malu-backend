import { DateTime } from "../../../../core/shared/Date";
import {
  TriggerWithDelay,
  TriggerWithStaticDate,
} from "../../../../core/messageCampaign/models/Trigger";
import { SendMessageQueue } from "../sendMessageQueue";

describe("SendMessageQueue", () => {
  it("should use DateTime.now() as base date when date is not provided", async () => {
    const now = new DateTime("2026-01-01T10:00");
    jest.spyOn(DateTime, "now").mockReturnValue(now);

    const trigger = new TriggerWithDelay({
      event: "createPatient",
      config: { delay: 10, delayUnit: "minutes" },
    });

    const calculateDelaySpy = jest
      .spyOn(trigger, "calculateDelay")
      .mockReturnValue(123);

    const queueProvider = {
      add: jest.fn(),
      repeat: jest.fn(),
      delete: jest.fn(),
      deleteRepeat: jest.fn(),
      process: jest.fn(),
    } as any;

    const sendMessageUseCase = { execute: jest.fn() } as any;

    const queue = new SendMessageQueue(queueProvider, sendMessageUseCase);

    await queue.add({
      userId: "user-id",
      patientId: "patient-id",
      messageCampaign: {
        id: "campaign-id",
        name: "test",
        templateMessage: "Hi",
        active: true,
        triggers: [],
      },
      origin: "CAMPAIGN",
      trigger,
    });

    expect(calculateDelaySpy).toHaveBeenCalledWith({ date: now });
    expect(queueProvider.add).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-id",
        patientId: "patient-id",
        origin: "CAMPAIGN",
      }),
      { delay: 123 },
    );
  });

  it("should use provided date when date is passed", async () => {
    const date = new DateTime("2026-01-01T12:00");

    const trigger = new TriggerWithDelay({
      event: "createPatient",
      config: { delay: 10, delayUnit: "minutes" },
    });

    const calculateDelaySpy = jest
      .spyOn(trigger, "calculateDelay")
      .mockReturnValue(456);

    const queueProvider = {
      add: jest.fn(),
      repeat: jest.fn(),
      delete: jest.fn(),
      deleteRepeat: jest.fn(),
      process: jest.fn(),
    } as any;

    const sendMessageUseCase = { execute: jest.fn() } as any;

    const queue = new SendMessageQueue(queueProvider, sendMessageUseCase);

    await queue.add({
      userId: "user-id",
      patientId: "patient-id",
      messageCampaign: {
        id: "campaign-id",
        name: "test",
        templateMessage: "Hi",
        active: true,
        triggers: [],
      },
      origin: "CAMPAIGN",
      trigger,
      date,
    });

    expect(calculateDelaySpy).toHaveBeenCalledWith({ date });
    expect(queueProvider.add).toHaveBeenCalledWith(
      expect.any(Object),
      { delay: 456 },
    );
  });

  it("should use TriggerWithStaticDate.calculateDelay() when trigger is static", async () => {
    const trigger = new TriggerWithStaticDate({
      event: "updateSchedule",
      config: { date: new DateTime("2026-01-01T10:00") },
    } as any);

    const calculateDelaySpy = jest
      .spyOn(trigger, "calculateDelay")
      .mockReturnValue(789);

    const queueProvider = {
      add: jest.fn(),
      repeat: jest.fn(),
      delete: jest.fn(),
      deleteRepeat: jest.fn(),
      process: jest.fn(),
    } as any;

    const sendMessageUseCase = { execute: jest.fn() } as any;

    const queue = new SendMessageQueue(queueProvider, sendMessageUseCase);

    await queue.add({
      userId: "user-id",
      patientId: "patient-id",
      messageCampaign: {
        id: "campaign-id",
        name: "test",
        templateMessage: "Hi",
        active: true,
        triggers: [],
      },
      origin: "CAMPAIGN",
      trigger,
    });

    expect(calculateDelaySpy).toHaveBeenCalledTimes(1);
    expect(queueProvider.add).toHaveBeenCalledWith(
      expect.any(Object),
      { delay: 789 },
    );
  });
});
