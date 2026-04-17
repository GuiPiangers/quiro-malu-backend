import { Queue, Worker, type RepeatOptions } from "bullmq";
import { IQueueProvider } from "./IQueueProvider";
import { redis } from "../../database/redis";
import { logger } from "../../utils/logger";

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

  async deleteRepeat({ jobId }: { jobId: string }) {
    await this.queue.removeJobScheduler(jobId);
  }

  async removeAllRepeatableJobs(): Promise<void> {
    const entries = await this.queue.getRepeatableJobs(0, -1);
    for (const entry of entries) {
      await this.queue.removeRepeatableByKey(entry.key);
    }
  }

  async addRepeatableEvery(jobTemplate: T, everyMs: number): Promise<void> {
    await this.queue.add(this.queueName, jobTemplate, {
      repeat: { every: everyMs },
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  async addRepeatableCron(
    jobTemplate: T,
    options: {
      pattern: string;
      tz?: string;
      immediately?: boolean;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ): Promise<void> {
    const repeat: RepeatOptions = { pattern: options.pattern };
    if (options.tz !== undefined) repeat.tz = options.tz;
    if (options.immediately !== undefined) repeat.immediately = options.immediately;
    if (options.startDate !== undefined) repeat.startDate = options.startDate;
    if (options.endDate !== undefined) repeat.endDate = options.endDate;
    if (options.limit !== undefined) repeat.limit = options.limit;

    await this.queue.add(this.queueName, jobTemplate, {
      repeat,
      removeOnComplete: true,
      removeOnFail: true,
    });
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

    worker.on("error", (error) => {
      logger.error({ err: error, queue: this.queueName }, "QueueProvider worker error");
    });
    worker.on("failed", (job, error) => {
      logger.error(
        {
          err: error,
          queue: this.queueName,
          jobId: job?.id,
          jobName: job?.name,
        },
        "QueueProvider job failed",
      );
    });
  }
}
