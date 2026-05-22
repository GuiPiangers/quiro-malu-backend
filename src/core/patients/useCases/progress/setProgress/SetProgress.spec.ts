import { createMockProgressRepository } from "../../../../../repositories/_mocks/ProgressRepositoryMock";
import { ProgressDTO } from "../../../models/Progress";
import { SetProgressUseCase } from "./SetProgressUseCase";

describe("setProgressUseCase", () => {
  let setProgressUseCase: SetProgressUseCase;
  const mockProgressRepository = createMockProgressRepository();

  beforeEach(() => {
    vi.clearAllMocks();
    setProgressUseCase = new SetProgressUseCase(mockProgressRepository);
  });

  describe("execute", () => {
    it("should call the repository Save method with the correct Data if Progress does not exist", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";

      const userId = "test-clinician-id";
      const progressData: ProgressDTO = {
        id: "test-progress-id",
        userId,
        patientId,
        actualProblem: "actualProblem",
        date: "2025-01-10T00:00",
        procedures: "procedures",
        schedulingId: "schedulingId",
        service: "service",
      };

      mockProgressRepository.get.mockResolvedValue([]);

      await setProgressUseCase.execute({ ...progressData, clinicId });

      expect(mockProgressRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.save).toHaveBeenCalledWith({
        ...progressData,
        clinicId,
      });
      expect(mockProgressRepository.update).not.toHaveBeenCalled();
    });

    it("should call the repository Update method with the correct Data if Progress does not exist", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const userId = "test-clinician-id";
      const progressData: ProgressDTO = {
        id: "test-progress-id",
        userId,
        patientId,
        actualProblem: "actualProblem",
        date: "2025-01-10T00:00",
        procedures: "procedures",
        schedulingId: "schedulingId",
        service: "service",
      };

      mockProgressRepository.get.mockResolvedValue([
        { patientId, id: "progress-id", userId },
      ]);

      await setProgressUseCase.execute({ ...progressData, clinicId });

      expect(mockProgressRepository.update).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.update).toHaveBeenCalledWith({
        ...progressData,
        clinicId,
      });
    });

    it("should Update data if optional params were not passed", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const progressId = "test-progress-id";

      const userId = "test-clinician-id";
      mockProgressRepository.get.mockResolvedValue([
        { patientId, id: progressId, userId },
      ]);

      await setProgressUseCase.execute({
        patientId,
        clinicId,
        id: progressId,
        userId,
      });

      expect(mockProgressRepository.update).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.update).toHaveBeenCalledWith({
        patientId,
        clinicId,
        id: progressId,
        userId,
        actualProblem: undefined,
        date: undefined,
        procedures: undefined,
        schedulingId: undefined,
        service: undefined,
      });
    });

    it("should save data if optional params were not passed", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const progressId = "test-progress-id";

      mockProgressRepository.get.mockResolvedValue([]);

      await expect(
        setProgressUseCase.execute({
          patientId,
          clinicId,
          id: progressId,
          userId: "",
        }),
      ).rejects.toThrow("O clínico (userId) é obrigatório");

      expect(mockProgressRepository.save).not.toHaveBeenCalled();
    });

    it("should propagate an error if the repository set method throws", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const errorMessage = "Failed to set patient";

      mockProgressRepository.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        setProgressUseCase.execute({
          patientId,
          clinicId,
          userId: "test-clinician-id",
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
