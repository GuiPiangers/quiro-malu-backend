import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { SchedulingWithPatientDTO } from "../../models/SchedulingWithPatient";
import { GetSchedulingUseCase } from "./GetSchedulingUseCase";

describe("getSchedulingUseCase", () => {
  let getSchedulingUseCase: GetSchedulingUseCase;
  const mockSchedulingRepository = createMockSchedulingRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    getSchedulingUseCase = new GetSchedulingUseCase(mockSchedulingRepository);
  });

  describe("execute", () => {
    it("should return the data of scheduling", async () => {
      const userId = "test-user-id";
      const id = "test-scheduling-id";

      const schedulingData: SchedulingWithPatientDTO = {
        id,
        patientId: "test-patient-id",
        date: "2025-01-01T10:00",
        duration: 3600,
        service: "service",
        status: "Atendido",
        patient: "papient name",
        phone: "(99) 99999 9999",
      };

      mockSchedulingRepository.get.mockResolvedValue([schedulingData]);

      const result = await getSchedulingUseCase.execute({ userId, id });

      expect(result).toEqual(schedulingData);
    });

    it("should call the repository get method with the correct params", async () => {
      const userId = "test-user-id";
      const id = "test-scheduling-id";

      mockSchedulingRepository.get.mockResolvedValue([
        {
          id,
          patientId: "test-patient-id",
          date: "2025-01-01T10:00",
          patient: "patient name",
          phone: "(99) 99999 9999",
        },
      ]);

      await getSchedulingUseCase.execute({ userId, id });

      expect(mockSchedulingRepository.get).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.get).toHaveBeenCalledWith({
        id,
        userId,
      });
    });

    it("should propagate an error if the repository method get throws", async () => {
      const userId = "test-user-id";
      const id = "test-scheduling-id";
      const errorMessage = "Failed to getQtdSchedulesByDay";

      mockSchedulingRepository.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        getSchedulingUseCase.execute({ userId, id }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
