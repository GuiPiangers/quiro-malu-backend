import { Queue, Worker } from "bullmq";
import { IQueueProvider } from "./IQueueProvider";
import { redis } from "../../database/redis";

const connection = redis;

export class QueueProvider<T> implements IQueueProvider<T> {
  private queue: Queue;
  readonly queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
    this.queue = new Queue(queueName, {
      connection,
    });
  }

  async repeat(
    jobTemplate: T,
    {
      cron,
      endDate,
      jobId,
      limit,
      startDate,
    }: {
      jobId: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      cron: string;
    },
  ): Promise<void> {
    await this.queue.upsertJobScheduler(
      jobId,
      { pattern: cron, limit, startDate, endDate },
      {
        data: jobTemplate,
        opts: { removeOnComplete: true, removeOnFail: true },
      },
    );
  }

  async deleteRepeat({ jobId }: { jobId: string }) {
    await this.queue.removeJobScheduler(jobId);
  }

  async add(jobTemplate: T, options?: { jobId?: string; delay?: number }) {
    await this.queue.add(this.queueName, jobTemplate, {
      jobId: options?.jobId,
      delay: options?.delay,
      removeOnComplete: 60 * 10, // 10 min
      removeOnFail: 60 * 10, // 10 min,
    });
  }

  async delete({ jobId }: { jobId: string }) {
    await this.queue.remove(jobId);
  }

  async process(callback: (job: T) => Promise<void>) {
    const worker = new Worker(
      this.queueName,
      async (job) => {
        await callback(job.data);
      },
      { connection, autorun: true },
    );

    worker.on("error", (error) => console.log(error));
  }
}
