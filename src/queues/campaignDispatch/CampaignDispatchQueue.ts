import { DispatchMessageCampaignUseCase } from "../../core/messageCampaign/useCases/dispatchMessageCampaign/dispatchMessageCampaignUseCase";
import { IQueueProvider } from "../../repositories/queueProvider/IQueueProvider";

export type CampaignDispatchJob = {
  campaignId: string;
};

export class CampaignDispatchQueue {
  constructor(
    private queueProvider: IQueueProvider<CampaignDispatchJob>,
    private dispatchMessageCampaignUseCase: DispatchMessageCampaignUseCase,
  ) {}

  async scheduleOnce({
    campaignId,
    scheduledAt,
  }: {
    campaignId: string;
    scheduledAt: Date;
  }) {
    const minute = scheduledAt.getMinutes();
    const hour = scheduledAt.getHours();

    const cron = "0 " + minute + " " + hour + " * * *";
    const jobId = "campaign:" + campaignId + ":once:" + scheduledAt.getTime();

    await this.queueProvider.repeat(
      { campaignId },
      {
        jobId,
        cron,
        startDate: scheduledAt,
        limit: 1,
      },
    );
  }

  async process() {
    await this.queueProvider.process(async (job) => {
      await this.dispatchMessageCampaignUseCase.execute(job);
    });
  }
}
