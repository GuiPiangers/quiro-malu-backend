import { DateTime } from "../../core/shared/Date";
import { MessageOrigin } from "../../core/messageCampaign/models/MessageLog";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";
import { IMessageCampaignRepository } from "../../repositories/messageCampaign/IMessageCampaignRepository";
import { IBirthdayMessageConfigRepository } from "../../repositories/messaging/IBirthdayMessageConfigRepository";
import { SendMessageQueue } from "../../repositories/queueProvider/sendMessageQueue/sendMessageQueue";
import { IQueueProvider } from "../../repositories/queueProvider/IQueueProvider";

type BirthdayQueueJob = {};

export class BirthdayQueue {
  private static readonly JOB_ID = "birthdayQueue";

  constructor(
    private queueProvider: IQueueProvider<BirthdayQueueJob>,
    private birthdayMessageConfigRepository: IBirthdayMessageConfigRepository,
    private messageCampaignRepository: IMessageCampaignRepository,
    private patientRepository: IPatientRepository,
    private sendMessageQueue: SendMessageQueue,
  ) {}

  async schedule() {
    const config = await this.birthdayMessageConfigRepository.get();

    if (!config) return;

    const cron = `0 ${config.sendMinute} ${config.sendHour} * * *`;

    await this.queueProvider.repeat({}, { cron, jobId: BirthdayQueue.JOB_ID });
  }

  async process() {
    await this.queueProvider.process(async () => {
      const config = await this.birthdayMessageConfigRepository.get();
      if (!config) return;

      const campaign = await this.messageCampaignRepository.getById(
        config.campaignId,
      );

      if (!campaign?.active) return;
      if (!campaign.userId) return;

      const today = DateTime.now().date;

      const patients = await this.patientRepository.getByDateOfBirth({
        dateOfBirth: today,
      });

      const origin: MessageOrigin = "BIRTHDAY";

      await Promise.all(
        patients
          .filter((p) => Boolean(p.id))
          .map((patient) =>
            this.sendMessageQueue.add({
              userId: campaign.userId!,
              patientId: patient.id!,
              messageCampaign: campaign,
              origin,
            }),
          ),
      );
    });
  }
}
