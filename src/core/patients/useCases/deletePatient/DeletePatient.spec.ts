import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { DeletePatientUseCase } from "./DeletePatientUseCase";

// Mock the patient repository with Jest
const mockPatientRepository: jest.Mocked<IPatientRepository> = {
  delete: jest.fn(),
  countAll: jest.fn(),
  getAll: jest.fn(),
  getByCpf: jest.fn(),
  getByHash: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  saveMany: jest.fn(),
  update: jest.fn(),
};

describe("DeletePatientUseCase", () => {
  let deletePatientUseCase: DeletePatientUseCase;

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
