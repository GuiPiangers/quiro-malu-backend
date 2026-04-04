import { DateTime as Luxon } from "luxon";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import { BeforeScheduleMessageEventHandlers } from "../beforeScheduleMessageEventHandlers";

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("BeforeScheduleMessageEventHandlers", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should schedule a BullMQ job on createSchedule for active configs", async () => {
    jest.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const beforeScheduleQueue = {
      upsert: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();

    const handlers = new BeforeScheduleMessageEventHandlers(
      beforeScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("beforeScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesBeforeSchedule: 60,
      isActive: true,
    });

    appEventListener.emit("createSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
      patientId: "patient-1",
      date: "2025-01-01T14:00",
      duration: 3600,
      service: "Consulta",
      status: "Agendado",
      reminderSentAt: null,
    });

    await flushPromises();

    expect(beforeScheduleQueue.upsert).toHaveBeenCalledWith(
      "before-schedule_user-1_schedule-1_cfg-1",
      {
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        beforeScheduleMessageId: "cfg-1",
      },
      60 * 60 * 1000,
    );
  });

  it("should not schedule a job when config is inactive", async () => {
    jest.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const beforeScheduleQueue = {
      upsert: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();

    const handlers = new BeforeScheduleMessageEventHandlers(
      beforeScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("beforeScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesBeforeSchedule: 60,
      isActive: false,
    });

    appEventListener.emit("createSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
      patientId: "patient-1",
      date: "2025-01-01T14:00",
      duration: 3600,
      service: "Consulta",
      status: "Agendado",
      reminderSentAt: null,
    });

    await flushPromises();

    expect(beforeScheduleQueue.upsert).not.toHaveBeenCalled();
  });

  it("should remove the job on updateSchedule when target time is in the past", async () => {
    jest.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const beforeScheduleQueue = {
      upsert: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();

    const handlers = new BeforeScheduleMessageEventHandlers(
      beforeScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("beforeScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesBeforeSchedule: 60,
      isActive: true,
    });

    appEventListener.emit("updateSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
      patientId: "patient-1",
      date: "2025-01-01T12:30",
      duration: 3600,
      service: "Consulta",
      status: "Agendado",
      reminderSentAt: null,
    });

    await flushPromises();

    expect(beforeScheduleQueue.remove).toHaveBeenCalledWith(
      "before-schedule_user-1_schedule-1_cfg-1",
    );
  });

  it("should remove jobs on deleteSchedule", async () => {
    const beforeScheduleQueue = {
      upsert: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();

    const handlers = new BeforeScheduleMessageEventHandlers(
      beforeScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("beforeScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesBeforeSchedule: 60,
      isActive: true,
    });

    appEventListener.emit("beforeScheduleMessageCreate", {
      id: "cfg-2",
      userId: "user-1",
      name: "cfg-2",
      minutesBeforeSchedule: 15,
      isActive: false,
    });

    appEventListener.emit("deleteSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
    });

    await flushPromises();

    expect(beforeScheduleQueue.remove).toHaveBeenCalledWith(
      "before-schedule_user-1_schedule-1_cfg-1",
    );

    expect(beforeScheduleQueue.remove).toHaveBeenCalledWith(
      "before-schedule_user-1_schedule-1_cfg-2",
    );
  });
});
