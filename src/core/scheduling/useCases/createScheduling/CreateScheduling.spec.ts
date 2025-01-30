import { mockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { SchedulingDTO } from "../../models/Scheduling";
import { CreateSchedulingUseCase } from "./CreateSchedulingUseCase";

describe("createSchedulingUseCase", () => {
  let createSchedulingUseCase: CreateSchedulingUseCase;

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    createSchedulingUseCase = new CreateSchedulingUseCase(
      mockSchedulingRepository,
    );
  });

  describe("execute", () => {
    it("should call the repository create method with the correct Data", async () => {
      const patientId = "test-patient-id";

      const schedulingData: SchedulingDTO & { userId: string; date: string } = {
        userId: "test-user-id",
        id: "test-Scheduling-id",
        patientId,
        date: "2025-01-10T00:00",
        duration: 3600,
        status: "Atendido",
        service: "Quiropraxia",
      };

      mockSchedulingRepository.list.mockResolvedValue([]);

      await createSchedulingUseCase.execute(schedulingData);

      expect(mockSchedulingRepository.save).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.save).toHaveBeenCalledWith(
        schedulingData,
      );
    });

    it("should call the repository create method with status param equal Atrasado if date is in the past and status is Agendado, Atrasado or undefined", async () => {
      const patientId = "test-patient-id";

      const schedulingData: SchedulingDTO & { userId: string; date: string } = {
        userId: "test-user-id",
        id: "test-Scheduling-id",
        patientId,
        date: "2025-01-11T00:00",
        duration: 3600,
        status: "Agendado",
        service: "Quiropraxia",
      };

      mockSchedulingRepository.list.mockResolvedValue([]);

      await createSchedulingUseCase.execute(schedulingData);
      await createSchedulingUseCase.execute({
        ...schedulingData,
        status: "Atrasado",
      });
      await createSchedulingUseCase.execute({
        ...schedulingData,
        status: undefined,
      });

      expect(mockSchedulingRepository.save).toHaveBeenCalled();
      expect(mockSchedulingRepository.save).toHaveBeenCalledWith({
        ...schedulingData,
        status: "Agendado",
      });
    });

    it("should call the repository create method with status param equal Agendado if date is in the past and status is Agendado, Atrasado or undefined", async () => {
      const patientId = "test-patient-id";

      const schedulingData: SchedulingDTO & { userId: string; date: string } = {
        userId: "test-user-id",
        id: "test-Scheduling-id",
        patientId,
        date: "2025-01-09T00:00",
        duration: 3600,
        status: "Agendado",
      };

      mockSchedulingRepository.list.mockResolvedValue([]);

      await createSchedulingUseCase.execute(schedulingData);
      await createSchedulingUseCase.execute({
        ...schedulingData,
        status: "Atrasado",
      });
      await createSchedulingUseCase.execute({
        ...schedulingData,
        status: undefined,
      });

      expect(mockSchedulingRepository.save).toHaveBeenCalled();
      expect(mockSchedulingRepository.save).toHaveBeenCalledWith({
        ...schedulingData,
        status: "Agendado",
      });
    });

    it("should throw an ApiError if scheduling are not available", async () => {
      const patientId = "test-patient-id";

      const schedulingData: SchedulingDTO & { userId: string; date: string } = {
        userId: "test-user-id",
        id: "test-Scheduling-id",
        patientId,
        date: "2025-01-10T14:00",
        duration: 3600,
        status: "Atendido",
        service: "Quiropraxia",
      };

      mockSchedulingRepository.list.mockResolvedValue([
        {
          ...schedulingData,
          date: "2025-01-10T114:30:00",
          patient: "Lucas Fernando",
          phone: "(99) 99999 9999",
        },
      ]);

      const responsePromise = createSchedulingUseCase.execute(schedulingData);

      expect(responsePromise).rejects.toThrow(ApiError);
      expect(mockSchedulingRepository.save).not.toHaveBeenCalled();
    });

    it("should propagate an error if the repository create method throws", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const errorMessage = "Failed to create patient";

      mockSchedulingRepository.list.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        createSchedulingUseCase.execute({
          patientId,
          userId,
          date: "2025-01-10T00:00",
          duration: 3600,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
