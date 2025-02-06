import { createMockProgressRepository } from "../../../../../repositories/_mocks/ProgressRepositoryMock";
import { ProgressDTO } from "../../../models/Progress";
import { SetProgressUseCase } from "./SetProgressUseCase";

describe("setProgressUseCase", () => {
  let setProgressUseCase: SetProgressUseCase;
  const mockProgressRepository = createMockProgressRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    setProgressUseCase = new SetProgressUseCase(mockProgressRepository);
  });

  describe("execute", () => {
    it("should call the repository Save method with the correct Data if Progress does not exist", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";

      const progressData: ProgressDTO = {
        id: "test-progress-id",
        patientId,
        actualProblem: "actualProblem",
        date: "2025-01-10T00:00",
        procedures: "procedures",
        schedulingId: "schedulingId",
        service: "service",
      };

      mockProgressRepository.get.mockResolvedValue([]);

      await setProgressUseCase.execute({ ...progressData, userId });

      expect(mockProgressRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.save).toHaveBeenCalledWith({
        ...progressData,
        userId,
      });
      expect(mockProgressRepository.update).not.toHaveBeenCalled();
    });

    it("should call the repository Update method with the correct Data if Progress does not exist", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const progressData: ProgressDTO = {
        id: "test-progress-id",
        patientId,
        actualProblem: "actualProblem",
        date: "2025-01-10T00:00",
        procedures: "procedures",
        schedulingId: "schedulingId",
        service: "service",
      };

      mockProgressRepository.get.mockResolvedValue([
        { patientId, id: "progress-id" },
      ]);

      await setProgressUseCase.execute({ ...progressData, userId });

      expect(mockProgressRepository.update).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.update).toHaveBeenCalledWith({
        ...progressData,
        userId,
      });
    });

    it("should Update data if optional params were not passed", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const progressId = "test-progress-id";

      mockProgressRepository.get.mockResolvedValue([{ patientId }]);

      await setProgressUseCase.execute({ patientId, userId, id: progressId });

      expect(mockProgressRepository.update).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.update).toHaveBeenCalledWith({
        patientId,
        userId,
        id: progressId,
        actualProblem: undefined,
        date: undefined,
        procedures: undefined,
        schedulingId: undefined,
        service: undefined,
      });
    });

    it("should save data if optional params were not passed", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const progressId = "test-progress-id";

      mockProgressRepository.get.mockResolvedValue([]);

      await setProgressUseCase.execute({ patientId, userId, id: progressId });

      expect(mockProgressRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.save).toHaveBeenCalledWith({
        patientId,
        userId,
        id: progressId,

        actualProblem: undefined,
        date: undefined,
        procedures: undefined,
        schedulingId: undefined,
        service: undefined,
      });
    });

    it("should propagate an error if the repository set method throws", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const errorMessage = "Failed to set patient";

      mockProgressRepository.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        setProgressUseCase.execute({ patientId, userId }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
