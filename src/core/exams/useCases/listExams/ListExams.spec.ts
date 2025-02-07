import {
  createMockExamFileStorageRepository,
  createMockExamRepository,
} from "../../../../repositories/_mocks/ExamRepositoryMock";
import { ListExamUseCase } from "./ListExamUseCase";

describe("ListExamUseCase", () => {
  let listExamUseCase: ListExamUseCase;

  const patientId = "patient1";
  const userId = "user1";
  const mockExamRepository = createMockExamRepository();
  const mockExamFileStorageRepository = createMockExamFileStorageRepository();

  beforeEach(() => {
    listExamUseCase = new ListExamUseCase(
      mockExamRepository,
      mockExamFileStorageRepository,
    );
  });

  describe("Verificação de chamadas de métodos com os parâmetros corretos", () => {
    it("deve chamar examRepository.list e examRepository.count com os parâmetros corretos (paginação válida)", async () => {
      const page = 3;
      const limit = 5;
      const offset = (page - 1) * limit;

      mockExamRepository.list.mockResolvedValue([]);
      mockExamRepository.count.mockResolvedValue({ total: 0 });

      await listExamUseCase.execute({ patientId, userId, page });

      expect(mockExamRepository.list).toHaveBeenCalledWith({
        patientId,
        userId,
        config: { limit, offset },
      });
      expect(mockExamRepository.count).toHaveBeenCalledWith({
        patientId,
        userId,
      });
    });

    it("deve ajustar page para 1 quando o valor informado for menor que 1", async () => {
      const invalidPage = 0;
      const limit = 5;
      const offset = 0;
      mockExamRepository.list.mockResolvedValue([]);
      mockExamRepository.count.mockResolvedValue({ total: 0 });

      await listExamUseCase.execute({ patientId, userId, page: invalidPage });

      expect(mockExamRepository.list).toHaveBeenCalledWith({
        patientId,
        userId,
        config: { limit, offset },
      });
    });

    it("deve ajustar page para 1 quando o valor não é informado", async () => {
      const limit = 5;
      const offset = 0;
      mockExamRepository.list.mockResolvedValue([]);
      mockExamRepository.count.mockResolvedValue({ total: 0 });

      await listExamUseCase.execute({ patientId, userId });

      expect(mockExamRepository.list).toHaveBeenCalledWith({
        patientId,
        userId,
        config: { limit, offset },
      });
    });

    it("deve chamar examFileStorage.get para cada exame retornado", async () => {
      const examData = [
        { id: "exam1", fileName: "file1.pdf", patientId: "test-patient-id" },
        { id: "exam2", fileName: "file2.pdf", patientId: "test-patient-id" },
      ];
      mockExamRepository.list.mockResolvedValue(examData);
      mockExamRepository.count.mockResolvedValue({ total: examData.length });
      mockExamFileStorageRepository.get.mockResolvedValue("dummy-url");

      await listExamUseCase.execute({ patientId, userId, page: 1 });

      expect(mockExamFileStorageRepository.get).toHaveBeenCalledTimes(
        examData.length,
      );
      examData.forEach((exam) => {
        expect(mockExamFileStorageRepository.get).toHaveBeenCalledWith({
          id: exam.id!,
          patientId,
          userId,
          originalName: exam.fileName,
        });
      });
    });
  });

  describe("Validação do valor retornado", () => {
    it("deve retornar os exames com as URLs corretas e o total", async () => {
      const page = 2;
      const examData = [
        { id: "exam1", fileName: "file1.pdf", patientId: "test-patient-id" },
        { id: "exam2", fileName: "file2.pdf", patientId: "test-patient-id" },
      ];
      const totalCount = { total: 10 };

      mockExamRepository.list.mockResolvedValue(examData);
      mockExamRepository.count.mockResolvedValue(totalCount);
      mockExamFileStorageRepository.get.mockImplementation(
        async ({ id, originalName }) => {
          return `http://example.com/${id}/${originalName}`;
        },
      );

      const result = await listExamUseCase.execute({ patientId, userId, page });

      expect(result).toMatchObject(totalCount);
      expect(result.exams).toEqual([
        {
          ...examData[0],
          url: `http://example.com/${examData[0].id}/${examData[0].fileName}`,
        },
        {
          ...examData[1],
          url: `http://example.com/${examData[1].id}/${examData[1].fileName}`,
        },
      ]);
    });
  });

  describe("Propagação de erros", () => {
    it("deve propagar erro se examRepository.list lançar um erro", async () => {
      const errorMessage = "Erro em list";
      mockExamRepository.list.mockRejectedValue(new Error(errorMessage));

      await expect(
        listExamUseCase.execute({ patientId, userId, page: 1 }),
      ).rejects.toThrow(errorMessage);
    });

    it("deve propagar erro se examRepository.count lançar um erro", async () => {
      const examData = [
        { id: "exam1", fileName: "file1.pdf", patientId: "test-patient-id" },
      ];
      mockExamRepository.list.mockResolvedValue(examData);
      const errorMessage = "Erro em count";
      mockExamRepository.count.mockRejectedValue(new Error(errorMessage));

      await expect(
        listExamUseCase.execute({ patientId, userId, page: 1 }),
      ).rejects.toThrow(errorMessage);
    });

    it("deve propagar erro se examFileStorage.get lançar um erro", async () => {
      const examData = [
        { id: "exam1", fileName: "file1.pdf", patientId: "test-patient-id" },
      ];
      mockExamRepository.list.mockResolvedValue(examData);
      mockExamRepository.count.mockResolvedValue({ total: 1 });
      const errorMessage = "Erro em get";
      mockExamFileStorageRepository.get.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        listExamUseCase.execute({ patientId, userId, page: 1 }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
