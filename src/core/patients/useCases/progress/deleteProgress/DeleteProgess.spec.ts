import { mockProgressRepository } from "../../../../../repositories/_mocks/ProgressRepositoryMock";
import { DeleteProgressUseCase } from "./DeleteProgressUseCase";

describe("DeleteProgressUseCase", () => {
  let deleteProgressUseCase: DeleteProgressUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteProgressUseCase = new DeleteProgressUseCase(mockProgressRepository);
  });

  describe("execute", () => {
    it("should call the repository delete method with the correct ProgressId and userId", async () => {
      const id = "test-Progress-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";

      await deleteProgressUseCase.execute({ id, userId, patientId });

      expect(mockProgressRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockProgressRepository.delete).toHaveBeenCalledWith({
        id,
        userId,
        patientId,
      });
    });

    it("should propagate an error if the repository delete method throws", async () => {
      const id = "test-Progress-id";
      const userId = "test-user-id";
      const patientId = "test-patient-id";
      const errorMessage = "Failed to delete Progress";

      mockProgressRepository.delete.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        deleteProgressUseCase.execute({ id, userId, patientId }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
