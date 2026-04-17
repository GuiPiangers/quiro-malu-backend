export abstract class IQueueProvider<T> {
  constructor(readonly queueName: string) {}
  abstract add(
    jobTemplate: T,
    options?: {
      jobId?: string;
      delay?: number;
    },
  ): Promise<void>;

  abstract addRepeatableEvery(jobTemplate: T, everyMs: number): Promise<void>;

  abstract addRepeatableCron(
    jobTemplate: T,
    options: {
      pattern: string;
      tz?: string;
      immediately?: boolean;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ): Promise<void>;

  abstract delete(data: { jobId: string }): Promise<void>;
  abstract deleteRepeat(data: { jobId: string }): Promise<void>;

  abstract removeAllRepeatableJobs(): Promise<void>;

  abstract process(callback: (job: T) => Promise<void>): Promise<void>;
}
