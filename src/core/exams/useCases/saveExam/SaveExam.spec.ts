import { SaveExamUseCase } from "./SaveExamUseCase";
import {
  createMockExamFileStorageRepository,
  createMockExamRepository,
} from "../../../../repositories/_mocks/ExamRepositoryMock";

describe("SaveExamUseCase", () => {
  let saveExamUseCase: SaveExamUseCase;
  const mockExamRepository = createMockExamRepository();
  const mockExamFileStorageRepository = createMockExamFileStorageRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    saveExamUseCase = new SaveExamUseCase(
      mockExamRepository,
      mockExamFileStorageRepository,
    );
  });
  const patientId = "patient1";
  const userId = "user1";
  const dummyFile = {
    originalname: "dummy.pdf",
    size: 1234,
  } as Express.Multer.File;

  describe("Verificação de chamadas de métodos com os parâmetros corretos", () => {
    it("deve chamar mockExamFileStorageRepository.save e mockExamRepository.save com os parâmetros corretos", async () => {
      await saveExamUseCase.execute({ file: dummyFile, patientId, userId });

      expect(mockExamFileStorageRepository.save).toHaveBeenCalledWith({
        file: dummyFile,
        id: expect.any(String),
        userId,
        patientId,
      });

      expect(mockExamRepository.save).toHaveBeenCalledWith({
        fileName: dummyFile.originalname,
        fileSize: dummyFile.size,
        patientId,
        userId,
        id: expect.any(String),
      });
    });
  });

  describe("Propagação de erros", () => {
    it("deve propagar erro se mockExamFileStorageRepository.save lançar um erro", async () => {
      const errorMessage = "Erro no save do storage";
      mockExamFileStorageRepository.save.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        saveExamUseCase.execute({ file: dummyFile, patientId, userId }),
      ).rejects.toThrow(errorMessage);
    });

    it("deve propagar erro se mockExamRepository.save lançar um erro", async () => {
      const errorMessage = "Erro no save do repositório";
      mockExamRepository.save.mockRejectedValue(new Error(errorMessage));

      await expect(
        saveExamUseCase.execute({ file: dummyFile, patientId, userId }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
