import { IDiagnosticRepository } from "../../../../../repositories/diagnostic/IDiagnosticRepository";
import { GetDiagnosticUseCase } from "./GetDiagnosticUseCase";

const mockDiagnosticRepository: jest.Mocked<IDiagnosticRepository> = {
  get: jest.fn(),
  save: jest.fn(),
  saveMany: jest.fn(),
  update: jest.fn(),
};

describe("GetDiagnosticUseCase", () => {
  let getDiagnosticUseCase: GetDiagnosticUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getDiagnosticUseCase = new GetDiagnosticUseCase(mockDiagnosticRepository);
  });

  describe("execute", () => {
    it("should call the repository Get method with the correct patientId and userId", async () => {
      const patientId = "test-patient-id";
      const userId = "test-user-id";

      await getDiagnosticUseCase.execute(patientId, userId);

      expect(mockDiagnosticRepository.get).toHaveBeenCalledTimes(1);
      expect(mockDiagnosticRepository.get).toHaveBeenCalledWith(
        patientId,
        userId,
      );
    });

    it("should return the diagnostic data from the repository", async () => {
      const diagnosticData = {
        patientId: "patientId",
        diagnostic: "diagnostic",
        treatmentPlan: "treatmentPlan",
      };
      mockDiagnosticRepository.get.mockResolvedValue(diagnosticData);

      const result = await getDiagnosticUseCase.execute("patientId", "userId");

      expect(result).toBe(diagnosticData);
    });

    it("should propagate an error if the repository Get method throws", async () => {
      const DiagnosticId = "test-Diagnostic-id";
      const userId = "test-user-id";
      const errorMessage = "Failed to Get Diagnostic";

      mockDiagnosticRepository.get.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        getDiagnosticUseCase.execute(DiagnosticId, userId),
      ).rejects.toThrow(errorMessage);
    });
  });
});
