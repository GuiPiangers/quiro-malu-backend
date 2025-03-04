import { ScheduleNotificationUseCase } from "./ScheduleNotificationUseCase";
import { createMockPushNotificationQueue } from "../../../../repositories/_mocks/PushNotificationQueueMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";

describe("ScheduleNotificationUseCase", () => {
  let pushNotificationQueue: typeof createMockPushNotificationQueue;
  let schedulingRepository: ReturnType<typeof createMockSchedulingRepository>;
  let useCase: ScheduleNotificationUseCase;

  beforeEach(() => {
    pushNotificationQueue = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    schedulingRepository = createMockSchedulingRepository();
    useCase = new ScheduleNotificationUseCase(
      pushNotificationQueue,
      schedulingRepository,
    );
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2025-01-01T12:15:00Z").getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("schedule", () => {
    it("should not schedule if id is missing", async () => {
      await useCase.schedule({
        userId: "user1",
        status: "Agendado",
        patientId: "123",
      });

      expect(schedulingRepository.get).not.toHaveBeenCalled();
      expect(pushNotificationQueue.add).not.toHaveBeenCalled();
    });

    it("should not schedule if no data returned from repository", async () => {
      schedulingRepository.get.mockResolvedValue([]);

      await useCase.schedule({
        id: "123",
        userId: "user1",
        status: "Agendado",
        patientId: "123",
      });

      expect(pushNotificationQueue.add).not.toHaveBeenCalled();
    });

    it("should not schedule if status is Cancelado or Atendido", async () => {
      schedulingRepository.get.mockResolvedValue([
        { patient: "John", patientId: "123", phone: "(51) 99999 9999" },
      ]);

      await useCase.schedule({
        id: "123",
        userId: "user1",
        status: "Cancelado",
        patientId: "123",
      });

      await useCase.schedule({
        id: "123",
        userId: "user1",
        status: "Atendido",
        patientId: "123",
      });

      expect(pushNotificationQueue.add).not.toHaveBeenCalled();
    });

    it("should not schedule if daley is more than 1 hour negative", async () => {
      schedulingRepository.get.mockResolvedValue([
        { patient: "John", patientId: "123", phone: "(51) 99999 9999" },
      ]);

      await useCase.schedule({
        id: "123",
        userId: "user1",
        date: "2025-01-01T11:15",
        status: "Agendado",
        patientId: "123",
      });

      expect(pushNotificationQueue.add).not.toHaveBeenCalled();
    });

    it("should schedule notification with correct parameters", async () => {
      schedulingRepository.get.mockResolvedValue([
        { patient: "Maria", patientId: "123", phone: "(51) 99999 9999" },
      ]);

      await useCase.schedule({
        id: "123",
        userId: "user1",
        date: "2025-01-01T12:30",
        status: "Agendado",
        patientId: "123",
      });

      expect(pushNotificationQueue.add).toHaveBeenCalledWith({
        delay: 0,
        notification: expect.objectContaining({
          title: "Consulta agendada com o(a) Maria está prestes a começar",
          message: "A consulta está agendada para às 12:30 do dia 01/01/2025",
          type: "scheduling",
        }),
        userId: "user1",
      });
    });
  });

  describe("deleteSchedule", () => {
    it("should delete notification from queue", async () => {
      await useCase.deleteSchedule({ scheduleId: "123" });
      expect(pushNotificationQueue.delete).toHaveBeenCalledWith({ id: "123" });
    });
  });

  describe("update", () => {
    it("should update existing schedule", async () => {
      schedulingRepository.get.mockResolvedValue([
        { patient: "Carlos", patientId: "123", phone: "(51) 99999 9999" },
      ]);

      await useCase.update({
        id: "123",
        userId: "user1",
        date: "2025-01-01T12:30",
        status: "Agendado",
        patientId: "123",
      });

      expect(pushNotificationQueue.delete).toHaveBeenCalledWith({ id: "123" });
      expect(pushNotificationQueue.add).toHaveBeenCalled();
    });

    it("should not update if id is missing", async () => {
      await useCase.update({
        userId: "user1",
        status: "Agendado",
        patientId: "123",
      });
      expect(pushNotificationQueue.delete).not.toHaveBeenCalled();
      expect(pushNotificationQueue.add).not.toHaveBeenCalled();
    });
  });

  //   describe("calculateDelay", () => {
  //     it("should calculate correct delay time", () => {
  //       const mockDate = new Date("2025-01-01T12:15:00Z");
  //       const instance = new DateTime(mockDate.toISOString());
  //       (DateTime.now as jest.Mock).mockReturnValue(
  //         new DateTime("2025-01-01T12:00:00Z"),
  //       );
  //       (DateTime.difference as jest.Mock).mockReturnValue(900000); // 15 minutos

  //       const result = useCase.calculateDelay(mockDate.toISOString(), 15);
  //       expect(result).toBe(900000);
  //     });
  //   });
});
