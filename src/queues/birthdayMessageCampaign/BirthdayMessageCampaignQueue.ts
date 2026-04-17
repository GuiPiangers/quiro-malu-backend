import { IQueueProvider } from "../../repositories/queueProvider/IQueueProvider";
import { BirthdayMessageCampaignJobData } from "./birthdayMessageCampaignJobData";

export class BirthdayMessageCampaignQueue {
  constructor(
    private queueProvider: IQueueProvider<BirthdayMessageCampaignJobData>,
  ) {}

  async scheduleDelivery(
    jobId: string,
    data: BirthdayMessageCampaignJobData,
    delayMs: number,
  ): Promise<void> {
    await this.remove(jobId);
    await this.queueProvider.add(data, {
      jobId,
      delay: delayMs,
    });
  }

  async remove(jobId: string): Promise<void> {
    try {
      await this.queueProvider.delete({ jobId });
    } catch {
      // job inexistente
    }
  }

  async process(): Promise<void> {
    await this.queueProvider.process(async (job) => {
      console.log("[birthdayMessageCampaign]", JSON.stringify(job));
    });
  }
}
