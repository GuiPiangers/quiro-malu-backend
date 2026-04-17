import { AfterScheduleQueue } from "../../../../queues/afterScheduleMessage/AfterScheduleQueue";
import { logger } from "../../../../utils/logger";
import { buildAfterScheduleMessageJobId } from "../../utils/buildAfterScheduleMessageJobId";
import { calculateScheduleMessageDelay } from "../../utils/calculateScheduleMessageDelay";
import { AppEventListener } from "../../../shared/observers/EventListener";

export type AfterScheduleMessageListenerConfig = {
  id: string;
  userId: string;
  name: string;
  minutesAfterSchedule: number;
  isActive: boolean;
};

export class AfterScheduleMessageEventHandlers {
  private isRegistered = false;
  private configsById = new Map<string, AfterScheduleMessageListenerConfig>();

  constructor(
    private afterScheduleQueue: AfterScheduleQueue,
    private appEventListener: AppEventListener,
  ) {}

  register() {
    if (this.isRegistered) return;

    this.appEventListener.on("afterScheduleMessageCreate", async (config) => {
      this.configsById.set(config.id, config);
    });

    this.appEventListener.on("afterScheduleMessageUpdate", async (config) => {
      this.configsById.set(config.id, config);
    });

    this.appEventListener.on("createSchedule", async (data) => {
      await this.handleCreateOrUpdateSchedule({
        type: "create",
        userId: data.userId,
        scheduleId: data.scheduleId,
        patientId: data.patientId,
        scheduleDate: data.date,
        status: data.status,
      });
    });

    this.appEventListener.on("updateSchedule", async (data) => {
      await this.handleCreateOrUpdateSchedule({
        type: "update",
        userId: data.userId,
        scheduleId: data.scheduleId,
        patientId: data.patientId,
        scheduleDate: data.date,
        status: data.status,
      });
    });

    this.appEventListener.on("deleteSchedule", async (data) => {
      await this.handleDeleteSchedule({
        userId: data.userId,
        scheduleId: data.scheduleId,
      });
    });

    this.appEventListener.on("afterScheduleMessageDelete", async (data) => {
      this.configsById.delete(data.id);
    });

    this.appEventListener.on("afterScheduleMessageSend", async (data) => {
      logger.info(
        {
          appEvent: "AfterScheduleMessageSend",
          userId: data.userId,
          patientId: data.patientId,
          schedulingId: data.schedulingId,
          afterScheduleMessageId: data.afterScheduleMessageId,
          instanceName: data.instanceName,
          toPhone: data.toPhone,
          providerMessageId: data.providerMessageId,
          messageLogId: data.messageLogId,
        },
        "after schedule WhatsApp message sent successfully",
      );
    });

    this.isRegistered = true;
  }

  private async handleCreateOrUpdateSchedule({
    type,
    userId,
    scheduleId,
    patientId,
    scheduleDate,
    status,
  }: {
    type: "create" | "update";
    userId: string;
    scheduleId: string;
    patientId: string;
    scheduleDate: string | undefined;
    status: string | undefined;
  }) {
    const configs = this.getActiveConfigsByUser(userId);

    await Promise.all(
      configs.map(async (config) => {
        const jobId = buildAfterScheduleMessageJobId({
          userId,
          scheduleId,
          afterScheduleMessageId: config.id,
        });

        // Só agenda se status é Atendido
        if (status !== "Atendido") {
          if (type === "update") await this.afterScheduleQueue.remove(jobId);
          return;
        }

        if (!scheduleDate) {
          if (type === "update") await this.afterScheduleQueue.remove(jobId);
          return;
        }

        const delay = calculateScheduleMessageDelay({
          scheduleDate,
          minutesOffset: config.minutesAfterSchedule,
          direction: "after",
        });

        await this.afterScheduleQueue.upsert(
          jobId,
          {
            userId,
            patientId,
            schedulingId: scheduleId,
            afterScheduleMessageId: config.id,
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
        const jobId = buildAfterScheduleMessageJobId({
          userId,
          scheduleId,
          afterScheduleMessageId: config.id,
        });

        await this.afterScheduleQueue.remove(jobId);
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
}
