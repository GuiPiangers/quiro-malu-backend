import { IQueueProvider } from "../../repositories/queueProvider/IQueueProvider";
import {
  SendAfterScheduleMessageJob,
  SendAfterScheduleMessageUseCase,
} from "../../core/messages/useCases/afterScheduleMessage/sendAfterScheduleMessage/sendAfterScheduleMessageUseCase";

export class AfterScheduleQueue {
  constructor(
    private queueProvider: IQueueProvider<SendAfterScheduleMessageJob>,
    private sendAfterScheduleMessageUseCase: SendAfterScheduleMessageUseCase,
  ) {}

  async upsert(jobId: string, data: SendAfterScheduleMessageJob, delay: number) {
    await this.remove(jobId);

    await this.queueProvider.add(data, {
      delay,
      jobId,
    });
  }

  async remove(jobId: string) {
    try {
      await this.queueProvider.delete({ jobId });
    } catch {
      // ignore when job does not exist
    }
  }

  async process() {
    await this.queueProvider.process(async (job) => {
      await this.sendAfterScheduleMessageUseCase.execute(job);
    });
  }
}
