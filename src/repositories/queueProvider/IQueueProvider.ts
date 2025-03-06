export abstract class IQueueProvider<T> {
  constructor(readonly queueName: string) {}
  abstract add(
    jobTemplate: T,
    options?: {
      jobId?: string;
      delay?: number;
    },
  ): Promise<void>;

  abstract repeat(
    jobTemplate: T,
    options: {
      jobId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      cron: string;
    },
  ): Promise<void>;

  abstract delete(data: { jobId: string }): Promise<void>;
  abstract deleteRepeat(data: { jobId: string }): Promise<void>;

  abstract process(callback: (job: T) => Promise<void>): Promise<void>;
}
