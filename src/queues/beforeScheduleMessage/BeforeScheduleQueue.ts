import { IQueueProvider } from "../../repositories/queueProvider/IQueueProvider";
import {
  SendBeforeScheduleMessageJob,
  SendBeforeScheduleMessageUseCase,
} from "../../core/messages/useCases/sendBeforeScheduleMessage/sendBeforeScheduleMessageUseCase";

export class BeforeScheduleQueue {
  constructor(
    private queueProvider: IQueueProvider<SendBeforeScheduleMessageJob>,
    private sendBeforeScheduleMessageUseCase: SendBeforeScheduleMessageUseCase,
  ) {}

  async upsert(jobId: string, data: SendBeforeScheduleMessageJob, delay: number) {
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
      await this.sendBeforeScheduleMessageUseCase.execute(job);
    });
  }
}
