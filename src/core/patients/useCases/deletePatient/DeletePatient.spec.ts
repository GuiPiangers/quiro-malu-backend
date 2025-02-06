import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { DeletePatientUseCase } from "./DeletePatientUseCase";

describe("DeletePatientUseCase", () => {
  let deletePatientUseCase: DeletePatientUseCase;
  const mockPatientRepository = createMockPatientRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    deletePatientUseCase = new DeletePatientUseCase(mockPatientRepository);
  });

  describe("execute", () => {
    it("should call the repository delete method with the correct patientId and userId", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";

      await deletePatientUseCase.execute(patientId, userId);

      expect(mockPatientRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockPatientRepository.delete).toHaveBeenCalledWith(
        patientId,
        userId,
      );
    });

    it("should propagate an error if the repository delete method throws", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";
      const errorMessage = "Failed to delete patient";

      mockPatientRepository.delete.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        deletePatientUseCase.execute(patientId, userId),
      ).rejects.toThrow(errorMessage);
    });
  });
});
