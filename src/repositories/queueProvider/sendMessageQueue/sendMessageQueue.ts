import { MessageCampaignDTO } from "../../../core/messageCampaign/models/MessageCampaign";
import {
  Trigger,
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
  id: string;
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

    await this.queueProvider.add(
      { messageCampaign, patientId, userId, schedulingId, origin },
      {
        delay,
      },
    );
  }

  async delete({ id }: DeleteSendMessageQueueParams) {
    await this.queueProvider.delete({ jobId: `a${id}` });
  }

  async process() {
    this.queueProvider.process(async (job) => {
      await this.sendMessageUseCase.execute(job);
    });
  }
}
