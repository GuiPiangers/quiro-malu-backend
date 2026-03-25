import { BeforeScheduleQueue } from "../../../../queues/beforeScheduleMessage/BeforeScheduleQueue";
import { DateTime } from "../../../shared/Date";
import { AppEventListener } from "../../../shared/observers/EventListener";

export type BeforeScheduleMessageListenerConfig = {
  id: string;
  userId: string;
  minutesBeforeSchedule: number;
  isActive: boolean;
};

export class BeforeScheduleMessageEventHandlers {
  private isRegistered = false;
  private configsById = new Map<string, BeforeScheduleMessageListenerConfig>();

  constructor(
    private beforeScheduleQueue: BeforeScheduleQueue,
    private appEventListener: AppEventListener,
  ) {}

  register() {
    if (this.isRegistered) return;

    this.appEventListener.on("beforeScheduleMessageCreate", async (config) => {
      this.configsById.set(config.id, config);
    });

    this.appEventListener.on("createSchedule", async (data) => {
      await this.handleCreateOrUpdateSchedule({
        type: "create",
        userId: data.userId,
        scheduleId: data.scheduleId,
        patientId: data.patientId,
        scheduleDate: data.date,
      });
    });

    this.appEventListener.on("updateSchedule", async (data) => {
      await this.handleCreateOrUpdateSchedule({
        type: "update",
        userId: data.userId,
        scheduleId: data.scheduleId,
        patientId: data.patientId,
        scheduleDate: data.date,
      });
    });

    this.appEventListener.on("deleteSchedule", async (data) => {
      await this.handleDeleteSchedule({
        userId: data.userId,
        scheduleId: data.scheduleId,
      });
    });

    this.isRegistered = true;
  }

  private async handleCreateOrUpdateSchedule({
    type,
    userId,
    scheduleId,
    patientId,
    scheduleDate,
  }: {
    type: "create" | "update";
    userId: string;
    scheduleId: string;
    patientId: string;
    scheduleDate: string | undefined;
  }) {
    const configs = this.getActiveConfigsByUser(userId);

    await Promise.all(
      configs.map(async (config) => {
        const jobId = this.buildJobId({
          userId,
          scheduleId,
          beforeScheduleMessageId: config.id,
        });

        const delay = this.calculateDelay(scheduleDate, config.minutesBeforeSchedule);

        if (delay <= 0) {
          if (type === "update") await this.beforeScheduleQueue.remove(jobId);
          return;
        }

        await this.beforeScheduleQueue.upsert(
          jobId,
          {
            userId,
            patientId,
            schedulingId: scheduleId,
            beforeScheduleMessageId: config.id,
          },
          delay,
        );
      }),
    );
  }

  private async handleDeleteSchedule({
    userId,
    scheduleId,
  }: {
    userId: string;
    scheduleId: string;
  }) {
    const configs = this.getConfigsByUser(userId);

    await Promise.all(
      configs.map(async (config) => {
        const jobId = this.buildJobId({
          userId,
          scheduleId,
          beforeScheduleMessageId: config.id,
        });

        await this.beforeScheduleQueue.remove(jobId);
      }),
    );
  }

  private getConfigsByUser(userId: string) {
    return Array.from(this.configsById.values()).filter(
      (config) => config.userId === userId,
    );
  }

  private getActiveConfigsByUser(userId: string) {
    return this.getConfigsByUser(userId).filter((config) => config.isActive);
  }

  private calculateDelay(
    scheduleDate: string | undefined,
    minutesBefore: number,
  ): number {
    if (!scheduleDate) return 0;

    const schedule = new DateTime(scheduleDate).value;
    const targetDate = schedule.minus({ minutes: minutesBefore });

    const now = DateTime.now().value;
    const delay = targetDate.toMillis() - now.toMillis();

    return delay > 0 ? delay : 0;
  }

  private buildJobId({
    userId,
    scheduleId,
    beforeScheduleMessageId,
  }: {
    userId: string;
    scheduleId: string;
    beforeScheduleMessageId: string;
  }) {
    const raw =
      "before-schedule_" + userId + "_" + scheduleId + "_" + beforeScheduleMessageId;

    return raw.substring(0, 250);
  }
}
