import { MessageCampaignDTO } from "../../../core/messageCampaign/models/MessageCampaign";
import {
  Trigger,
  TriggerWithDelay,
  TriggerWithStaticDate,
} from "../../../core/messageCampaign/models/Trigger";
import { MessageOrigin } from "../../../core/messageCampaign/models/MessageLog";
import { SendMessageUseCase } from "../../../core/messageCampaign/useCases/sendMessage/sendMessageUseCase";
import { DateTime } from "../../../core/shared/Date";
import { IQueueProvider } from "../IQueueProvider";

export type SendMessageJob = {
  userId: string;
  patientId: string;
  schedulingId?: string;
  messageCampaign: MessageCampaignDTO;
  origin: MessageOrigin;
};

export type SendMessageQueueParams = SendMessageJob & {
  trigger?: Trigger;
  date?: DateTime;
};

export type DeleteSendMessageQueueParams = {
  jobId: string;
};

export class SendMessageQueue {
  constructor(
    private queueProvider: IQueueProvider<SendMessageJob>,
    private sendMessageUseCase: SendMessageUseCase,
  ) {}

  async add({
    messageCampaign,
    patientId,
    trigger,
    userId,
    schedulingId,
    date,
    origin,
  }: SendMessageQueueParams) {
    let delay = 0;

    if (trigger) {
      const baseDate = date ?? DateTime.now();
      delay =
        trigger instanceof TriggerWithStaticDate
          ? trigger.calculateDelay()
          : trigger.calculateDelay({ date: baseDate });
    }

    const jobId = this.buildJobId({
      messageCampaign,
      patientId,
      schedulingId,
      trigger,
    });

    if (jobId) {
      try {
        await this.queueProvider.delete({ jobId });
      } catch {
        // ignore when job does not exist
      }

      await this.queueProvider.add(
        { messageCampaign, patientId, userId, schedulingId, origin },
        {
          delay,
          jobId,
        },
      );

      return;
    }

    await this.queueProvider.add(
      { messageCampaign, patientId, userId, schedulingId, origin },
      {
        delay,
      },
    );
  }

  async delete({ jobId }: DeleteSendMessageQueueParams) {
    await this.queueProvider.delete({ jobId });
  }

  async process() {
    this.queueProvider.process(async (job) => {
      await this.sendMessageUseCase.execute(job);
    });
  }

  private buildJobId({
    messageCampaign,
    patientId,
    schedulingId,
    trigger,
  }: {
    messageCampaign: MessageCampaignDTO;
    patientId: string;
    schedulingId?: string;
    trigger?: Trigger;
  }) {
    if (messageCampaign.id == null) return null;
    if (schedulingId == null) return null;

    const triggerKey = this.getTriggerKey(trigger);

    const raw =
      "sendWhatsMessage:" +
      messageCampaign.id +
      ":" +
      schedulingId +
      ":" +
      patientId +
      ":" +
      triggerKey;

    return raw.substring(0, 250);
  }

  private getTriggerKey(trigger?: Trigger) {
    if (trigger == null) return "noTrigger";

    if (trigger instanceof TriggerWithDelay) {
      const config = trigger.config;
      return "delay_" + String(config.delay) + "_" + String(config.delayUnit);
    }

    if (trigger instanceof TriggerWithStaticDate) {
      const config = trigger.config;
      const dateStr = config.date?.dateTime ? config.date.dateTime : "";
      return "static_" + dateStr;
    }

    return "event_" + trigger.event;
  }
}
