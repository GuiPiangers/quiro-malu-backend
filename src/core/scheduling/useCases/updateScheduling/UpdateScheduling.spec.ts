import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { SchedulingDTO } from "../../models/Scheduling";
import { UpdateSchedulingUseCase } from "./UpdateSchedulingUseCase";

describe("updateSchedulingUseCase", () => {
  let updateSchedulingUseCase: UpdateSchedulingUseCase;
  const mockSchedulingRepository = createMockSchedulingRepository();

  describe("execute", () => {
    beforeAll(() => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
    });

    beforeEach(() => {
      jest.clearAllMocks();
      updateSchedulingUseCase = new UpdateSchedulingUseCase(
        mockSchedulingRepository,
      );
    });

    it("should call the repository update method with the correct Data", async () => {
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

      await updateSchedulingUseCase.execute(schedulingData);

      expect(mockSchedulingRepository.update).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        schedulingData,
      );
    });

    it("should call the repository update method with status param equal Atrasado if date is in the past and status is Agendado, Atrasado or undefined", async () => {
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

      await updateSchedulingUseCase.execute(schedulingData);
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: "Atrasado",
      });
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: undefined,
      });

      expect(mockSchedulingRepository.update).toHaveBeenCalled();
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith({
        ...schedulingData,
        status: "Agendado",
      });
    });

    it("should call the repository update method with status param equal Agendado if date is in the past and status is Agendado, Atrasado or undefined", async () => {
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

      await updateSchedulingUseCase.execute(schedulingData);
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: "Atrasado",
      });
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: undefined,
      });

      expect(mockSchedulingRepository.update).toHaveBeenCalled();
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith({
        ...schedulingData,
        status: "Agendado",
      });
    });

    it("should throw an ApiError if scheduling is not available", async () => {
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

      const responsePromise = updateSchedulingUseCase.execute(schedulingData);

      expect(responsePromise).rejects.toThrow(ApiError);
      expect(mockSchedulingRepository.update).not.toHaveBeenCalled();
    });

    it("should not validate if is available if date param is not passed to be updated", async () => {
      const patientId = "test-patient-id";

      const schedulingData: SchedulingDTO & { userId: string } = {
        userId: "test-user-id",
        id: "test-Scheduling-id",
        patientId,
        duration: 3600,
        status: "Atendido",
        service: "Quiropraxia",
      };

      await updateSchedulingUseCase.execute(schedulingData);

      expect(mockSchedulingRepository.list).not.toHaveBeenCalled();
      expect(mockSchedulingRepository.update).toBeCalled();
    });

    it("should throw an ApiError if schedulingId parameter is not passed", async () => {
      const patientId = "test-patient-id";

      const schedulingData: SchedulingDTO & { userId: string; date: string } = {
        userId: "test-user-id",
        patientId,
        date: "2025-01-10T14:00",
        duration: 3600,
        status: "Atendido",
        service: "Quiropraxia",
      };

      await expect(
        updateSchedulingUseCase.execute(schedulingData),
      ).rejects.toThrow(ApiError);
    });

    it("should propagate an error if the repository update method throws", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const errorMessage = "Failed to update patient";

      mockSchedulingRepository.list.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      mockSchedulingRepository.list.mockRejectedValueOnce(
        new Error("O id deve ser informado"),
      );

      await expect(
        updateSchedulingUseCase.execute({
          id: "test-Scheduling-id",
          patientId,
          userId,
          date: "2025-01-10T00:00",
          duration: 3600,
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
