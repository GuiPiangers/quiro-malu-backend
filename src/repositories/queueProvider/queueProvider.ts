import { Queue, Worker } from "bullmq";
import { IQueueProvider } from "./IQueueProvider";
import { redis } from "../../database/redis";

const connection = redis;

export class QueueProvider<T> implements IQueueProvider<T> {
  private pushNotificationQueue: Queue;
  readonly queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
    this.pushNotificationQueue = new Queue(queueName, {
      connection,
    });
  }

  async add(jobTemplate: T, options?: { jobId?: string; delay?: number }) {
    await this.pushNotificationQueue.add(this.queueName, jobTemplate, {
      jobId: options?.jobId,
      delay: options?.delay,
      removeOnComplete: 60 * 10, // 10 min
      removeOnFail: 60 * 10, // 10 min,
    });
  }

  async delete({ jobId }: { jobId: string }) {
    await this.pushNotificationQueue.remove(jobId);
  }

  async process(callback: (job: T) => Promise<void>) {
    const worker = new Worker(
      "pushNotification",
      async (job) => {
        await callback(job.data);
      },
      { connection, autorun: true },
    );

    worker.on("error", (error) => console.log(error));
  }
}
