import { MessageCampaignDTO } from "../../../core/messageCampaign/models/MessageCampaign";
import { TriggerBase } from "../../../core/messageCampaign/models/Trigger";
import { SendMessageUseCase } from "../../../core/messageCampaign/useCases/sendMessage/sendMessageUseCase";
import { DateTime } from "../../../core/shared/Date";
import { IQueueProvider } from "../IQueueProvider";

export type SendMessageQueuePrams = {
  userId: string;
  patientId: string;
  schedulingId?: string;
  messageCampaign: MessageCampaignDTO;
  trigger: TriggerBase;
  date?: DateTime;
};

export type deleteNotificationQueueParams = {
  id: string;
};

export class SendMessageQueue {
  constructor(
    private queueProvider: IQueueProvider<SendMessageQueuePrams>,
    private sendMessageUseCase: SendMessageUseCase,
  ) {}

  async add({
    messageCampaign,
    patientId,
    trigger,
    userId,
    schedulingId,
    date,
  }: SendMessageQueuePrams) {
    await this.queueProvider.add(
      { messageCampaign, patientId, trigger, userId, schedulingId, date },
      {
        delay: date ? trigger.calculateDelay({ date }) : undefined,
        jobId: `a${messageCampaign.id}`,
      },
    );
  }

  async delete({ id }: deleteNotificationQueueParams) {
    await this.queueProvider.delete({ jobId: `a${id}` });
  }

  async process() {
    this.queueProvider.process(async (job) => {
      this.sendMessageUseCase.execute(job as SendMessageQueuePrams);
    });
  }
}
