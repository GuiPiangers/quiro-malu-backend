import { SaveExamUseCase } from "./SaveExamUseCase";
import {
  mockExamFileStorageRepository,
  mockExamRepository,
} from "../../../../repositories/_mocks/ExamRepositoryMock";

describe("SaveExamUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let saveExamUseCase: SaveExamUseCase;

  const patientId = "patient1";
  const userId = "user1";
  const dummyFile = {
    originalname: "dummy.pdf",
    size: 1234,
  } as Express.Multer.File;

  beforeEach(() => {
    jest.clearAllMocks();
    saveExamUseCase = new SaveExamUseCase(
      mockExamRepository,
      mockExamFileStorageRepository,
    );
  });

  describe("Verificação de chamadas de métodos com os parâmetros corretos", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

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
    beforeEach(() => {
      jest.clearAllMocks();
    });

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
