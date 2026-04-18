import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ApiError } from "../../../../utils/ApiError";
import { SchedulingDTO } from "../../models/Scheduling";
import { UpdateSchedulingUseCase } from "./UpdateSchedulingUseCase";

const defaultExistingSchedule = {
  id: "test-Scheduling-id",
  patientId: "test-patient-id",
  date: "2025-01-10T00:00",
  duration: 3600,
  status: "Agendado" as const,
  service: "Quiropraxia",
  patient: "Paciente",
  phone: "(11) 91111-1111",
};

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
      mockSchedulingRepository.get.mockResolvedValue([
        { ...defaultExistingSchedule } as any,
      ]);
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

      expect(mockSchedulingRepository.get).toHaveBeenCalledWith({
        id: "test-Scheduling-id",
        userId: "test-user-id",
      });
      expect(mockSchedulingRepository.update).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: schedulingData.userId,
          id: schedulingData.id,
          patientId: schedulingData.patientId,
          date: schedulingData.date,
          duration: schedulingData.duration,
          status: schedulingData.status,
          service: schedulingData.service,
        }),
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

      mockSchedulingRepository.get.mockResolvedValue([
        { ...defaultExistingSchedule, date: "2025-01-11T00:00" } as any,
      ]);
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
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...schedulingData,
          status: "Agendado",
        }),
      );
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

      mockSchedulingRepository.get.mockResolvedValue([
        { ...defaultExistingSchedule, date: "2025-01-09T00:00" } as any,
      ]);
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
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...schedulingData,
          status: "Agendado",
        }),
      );
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

      mockSchedulingRepository.get.mockResolvedValue([
        {
          ...defaultExistingSchedule,
          date: "2025-01-10T14:00",
          status: "Atendido",
        } as any,
      ]);

      mockSchedulingRepository.list.mockResolvedValue([
        {
          duration: 3600,
          patientId: "test-patient-id-2",
          id: "test-Scheduling-id-2",
          date: "2025-01-10T14:30",
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

      mockSchedulingRepository.get.mockResolvedValue([
        {
          id: "test-Scheduling-id",
          patientId,
          duration: 3600,
          status: "Agendado",
          service: "Quiropraxia",
          patient: "Paciente",
          phone: "(11) 91111-1111",
        } as any,
      ]);

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

      expect(mockSchedulingRepository.get).not.toHaveBeenCalled();
    });

    it("should throw ApiError Agendamento não encontrado when scheduling does not exist", async () => {
      mockSchedulingRepository.get.mockResolvedValue([]);

      await expect(
        updateSchedulingUseCase.execute({
          userId: "test-user-id",
          id: "non-existent-scheduling-id",
          patientId: "test-patient-id",
          date: "2025-01-10T00:00",
          duration: 3600,
          status: "Agendado",
          service: "Quiropraxia",
        }),
      ).rejects.toMatchObject({
        message: "Agendamento não encontrado",
        statusCode: 404,
      });

      expect(mockSchedulingRepository.update).not.toHaveBeenCalled();
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
