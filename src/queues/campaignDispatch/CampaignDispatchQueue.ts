import {
  DispatchMessageCampaignMode,
  DispatchMessageCampaignUseCase,
} from "../../core/messageCampaign/useCases/dispatchMessageCampaign/dispatchMessageCampaignUseCase";
import { IQueueProvider } from "../../repositories/queueProvider/IQueueProvider";

export type CampaignDispatchJob = {
  campaignId: string;
  mode: DispatchMessageCampaignMode;
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
      { campaignId, mode: "ONCE" },
      {
        jobId,
        cron,
        startDate: scheduledAt,
        limit: 1,
      },
    );
  }

  async scheduleEvery7Days({
    campaignId,
    startAt,
  }: {
    campaignId: string;
    startAt: Date;
  }) {
    const minute = startAt.getMinutes();
    const hour = startAt.getHours();
    const dayOfWeek = startAt.getDay();

    const cron = "0 " + minute + " " + hour + " * * " + dayOfWeek;
    const jobId = "campaign:" + campaignId + ":every7days";

    await this.queueProvider.repeat(
      { campaignId, mode: "EVERY_7_DAYS" },
      {
        jobId,
        cron,
        startDate: startAt,
      },
    );
  }

  async unscheduleEvery7Days({ campaignId }: { campaignId: string }) {
    const jobId = "campaign:" + campaignId + ":every7days";
    await this.queueProvider.deleteRepeat({ jobId });
  }

  async process() {
    await this.queueProvider.process(async (job) => {
      await this.dispatchMessageCampaignUseCase.execute(job);
    });
  }
}
