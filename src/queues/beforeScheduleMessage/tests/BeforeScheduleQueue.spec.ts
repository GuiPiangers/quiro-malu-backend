import { BeforeScheduleQueue } from "../BeforeScheduleQueue";

describe("BeforeScheduleQueue", () => {
  it("upsert should remove existing job and add a new one", async () => {
    const queueProvider = {
      add: vi.fn(),
      delete: vi.fn().mockRejectedValue(new Error("not found")),
      process: vi.fn(),
    };

    const sendBeforeScheduleMessageUseCase = {
      execute: vi.fn(),
    };

    const queue = new BeforeScheduleQueue(
      queueProvider as any,
      sendBeforeScheduleMessageUseCase as any,
    );

    await queue.upsert(
      "job-1",
      {
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        beforeScheduleMessageId: "cfg-1",
      },
      1234,
    );

    expect(queueProvider.delete).toHaveBeenCalledWith({ jobId: "job-1" });
    expect(queueProvider.add).toHaveBeenCalledWith(
      {
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        beforeScheduleMessageId: "cfg-1",
      },
      { delay: 1234, jobId: "job-1" },
    );
  });

  it("remove should ignore when job does not exist", async () => {
    const queueProvider = {
      add: vi.fn(),
      delete: vi.fn().mockRejectedValue(new Error("not found")),
      process: vi.fn(),
    };

    const sendBeforeScheduleMessageUseCase = {
      execute: vi.fn(),
    };

    const queue = new BeforeScheduleQueue(
      queueProvider as any,
      sendBeforeScheduleMessageUseCase as any,
    );

    await expect(queue.remove("job-1")).resolves.toBeUndefined();
  });

  it("process should delegate to SendBeforeScheduleMessageUseCase", async () => {
    const data = {
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    };

    const queueProvider = {
      add: vi.fn(),
      delete: vi.fn(),
      process: vi.fn(async (callback: any) => {
        await callback(data);
      }),
    };

    const sendBeforeScheduleMessageUseCase = {
      execute: vi.fn(),
    };

    const queue = new BeforeScheduleQueue(
      queueProvider as any,
      sendBeforeScheduleMessageUseCase as any,
    );

    await queue.process();

    expect(sendBeforeScheduleMessageUseCase.execute).toHaveBeenCalledWith(data);
  });
});
