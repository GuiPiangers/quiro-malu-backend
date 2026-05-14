import { BeforeScheduleQueue } from "../../../../queues/beforeScheduleMessage/BeforeScheduleQueue";
import type { IBeforeScheduleMessageRepository } from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { logger } from "../../../../utils/logger";
import { buildBeforeScheduleMessageJobId } from "../../utils/buildBeforeScheduleMessageJobId";
import { calculateScheduleMessageDelay } from "../../utils/calculateScheduleMessageDelay";
import { AppEventListener } from "../../../shared/observers/EventListener";

export type BeforeScheduleMessageListenerConfig = {
  id: string;
  userId: string;
  name: string;
  minutesBeforeSchedule: number;
  isActive: boolean;
};

export class BeforeScheduleMessageEventHandlers {
  private isRegistered = false;

  constructor(
    private beforeScheduleQueue: BeforeScheduleQueue,
    private appEventListener: AppEventListener,
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
  ) {}

  register() {
    if (this.isRegistered) return;

    this.appEventListener.on("createSchedule", async (data) => {
      await this.handleCreateOrUpdateSchedule({
        type: "create",
        userId: data.userId,
        clinicId: data.clinicId,
        scheduleId: data.scheduleId,
        patientId: data.patientId,
        scheduleDate: data.date,
      });
    });

    this.appEventListener.on("updateSchedule", async (data) => {
      await this.handleCreateOrUpdateSchedule({
        type: "update",
        userId: data.userId,
        clinicId: data.clinicId,
        scheduleId: data.scheduleId,
        patientId: data.patientId,
        scheduleDate: data.date,
      });
    });

    this.appEventListener.on("deleteSchedule", async (data) => {
      await this.handleDeleteSchedule({
        userId: data.userId,
        clinicId: data.clinicId,
        scheduleId: data.scheduleId,
      });
    });

    this.appEventListener.on("beforeScheduleMessageSend", async (data) => {
      logger.info(
        {
          appEvent: "BeforeScheduleMessageSend",
          userId: data.userId,
          patientId: data.patientId,
          schedulingId: data.schedulingId,
          beforeScheduleMessageId: data.beforeScheduleMessageId,
          instanceName: data.instanceName,
          toPhone: data.toPhone,
          providerMessageId: data.providerMessageId,
          messageLogId: data.messageLogId,
        },
        "before schedule WhatsApp message sent successfully",
      );
    });

    this.isRegistered = true;
  }

  private async handleCreateOrUpdateSchedule({
    type,
    userId,
    clinicId,
    scheduleId,
    patientId,
    scheduleDate,
  }: {
    type: "create" | "update";
    userId: string;
    clinicId: string;
    scheduleId: string;
    patientId: string;
    scheduleDate: string | undefined;
  }) {
    const rows = await this.beforeScheduleMessageRepository.listByUserId({
      userId,
    });
    const configs = rows.filter((row) => row.isActive);

    await Promise.all(
      configs.map(async (config) => {
        const jobId = buildBeforeScheduleMessageJobId({
          userId,
          scheduleId,
          beforeScheduleMessageId: config.id,
        });

        const delay = this.calculateDelay(
          scheduleDate,
          config.minutesBeforeSchedule,
        );

        if (delay <= 0) {
          if (type === "update") await this.beforeScheduleQueue.remove(jobId);
          return;
        }

        await this.beforeScheduleQueue.upsert(
          jobId,
          {
            userId,
            clinicId,
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
    clinicId: _clinicId,
    scheduleId,
  }: {
    userId: string;
    clinicId: string;
    scheduleId: string;
  }) {
    const configs = await this.beforeScheduleMessageRepository.listByUserId({
      userId,
    });

    await Promise.all(
      configs.map(async (config) => {
        const jobId = buildBeforeScheduleMessageJobId({
          userId,
          scheduleId,
          beforeScheduleMessageId: config.id,
        });

        await this.beforeScheduleQueue.remove(jobId);
      }),
    );
  }

  private calculateDelay(
    scheduleDate: string | undefined,
    minutesBefore: number,
  ): number {
    return calculateScheduleMessageDelay({
      scheduleDate,
      minutesOffset: minutesBefore,
      direction: "before",
    });
  }
}
