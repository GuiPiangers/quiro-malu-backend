import { DateTime as Luxon } from "luxon";
import { logger } from "../../../../../utils/logger";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import { AfterScheduleMessageEventHandlers } from "../afterScheduleMessageEventHandlers";

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("AfterScheduleMessageEventHandlers", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("não deve agendar job no createSchedule quando status não é Atendido", async () => {
    vi.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const afterScheduleQueue = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();
    const handlers = new AfterScheduleMessageEventHandlers(
      afterScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("afterScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesAfterSchedule: 60,
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

    expect(afterScheduleQueue.upsert).not.toHaveBeenCalled();
  });

  it("deve agendar job no updateSchedule quando status é Atendido", async () => {
    vi.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const afterScheduleQueue = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();
    const handlers = new AfterScheduleMessageEventHandlers(
      afterScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("afterScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesAfterSchedule: 60,
      isActive: true,
    });

    appEventListener.emit("updateSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
      patientId: "patient-1",
      date: "2025-01-01T14:00",
      duration: 3600,
      service: "Consulta",
      status: "Atendido",
      reminderSentAt: null,
    });

    await flushPromises();

    expect(afterScheduleQueue.upsert).toHaveBeenCalledWith(
      "after-schedule_user-1_schedule-1_cfg-1",
      {
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        afterScheduleMessageId: "cfg-1",
      },
      3 * 60 * 60 * 1000,
    );
  });

  it("deve remover o job no updateSchedule quando status não é Atendido", async () => {
    vi.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const afterScheduleQueue = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();
    const handlers = new AfterScheduleMessageEventHandlers(
      afterScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("afterScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesAfterSchedule: 60,
      isActive: true,
    });

    appEventListener.emit("updateSchedule", {
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

    expect(afterScheduleQueue.remove).toHaveBeenCalledWith(
      "after-schedule_user-1_schedule-1_cfg-1",
    );
  });

  it("não deve agendar job quando config está inativa", async () => {
    vi.setSystemTime(
      Luxon.fromISO("2025-01-01T12:00", { zone: "America/Sao_Paulo" }).toMillis(),
    );

    const afterScheduleQueue = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();
    const handlers = new AfterScheduleMessageEventHandlers(
      afterScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("afterScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesAfterSchedule: 60,
      isActive: false,
    });

    appEventListener.emit("updateSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
      patientId: "patient-1",
      date: "2025-01-01T14:00",
      duration: 3600,
      service: "Consulta",
      status: "Atendido",
      reminderSentAt: null,
    });

    await flushPromises();

    expect(afterScheduleQueue.upsert).not.toHaveBeenCalled();
  });

  it("deve remover jobs no deleteSchedule", async () => {
    const afterScheduleQueue = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const appEventListener = new AppEventListener();
    const handlers = new AfterScheduleMessageEventHandlers(
      afterScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("afterScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "cfg-1",
      minutesAfterSchedule: 60,
      isActive: true,
    });

    appEventListener.emit("afterScheduleMessageCreate", {
      id: "cfg-2",
      userId: "user-1",
      name: "cfg-2",
      minutesAfterSchedule: 15,
      isActive: false,
    });

    appEventListener.emit("deleteSchedule", {
      userId: "user-1",
      scheduleId: "schedule-1",
    });

    await flushPromises();

    expect(afterScheduleQueue.remove).toHaveBeenCalledWith(
      "after-schedule_user-1_schedule-1_cfg-1",
    );

    expect(afterScheduleQueue.remove).toHaveBeenCalledWith(
      "after-schedule_user-1_schedule-1_cfg-2",
    );
  });

  it("deve logar no afterScheduleMessageSend", async () => {
    const infoSpy = vi
      .spyOn(logger, "info")
      .mockImplementation(() => logger as any);

    const afterScheduleQueue = {
      upsert: vi.fn(),
      remove: vi.fn(),
    };

    const appEventListener = new AppEventListener();
    const handlers = new AfterScheduleMessageEventHandlers(
      afterScheduleQueue as any,
      appEventListener,
    );

    handlers.register();

    appEventListener.emit("afterScheduleMessageSend", {
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      afterScheduleMessageId: "cfg-1",
      instanceName: "clinic-user-1",
      toPhone: "5551999999999",
      providerMessageId: "wa-1",
      messageLogId: "log-1",
    });

    await flushPromises();

    expect(infoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        appEvent: "AfterScheduleMessageSend",
        userId: "user-1",
        messageLogId: "log-1",
        providerMessageId: "wa-1",
      }),
      "after schedule WhatsApp message sent successfully",
    );

    infoSpy.mockRestore();
  });
});
