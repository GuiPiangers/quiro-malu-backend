import { Exam, ExamDTO } from "../Exam";

describe("exam", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create exam with provided id", () => {
    const mockId = "12345";

    const examData: ExamDTO = {
      id: mockId,
      fileName: "exam.pdf",
      patientId: "test-patient-id",
      fileSize: 100,
    };

    const exam = new Exam(examData);

    expect(exam.id).toBe(mockId);
    expect(exam.fileName).toBe("exam.pdf");
    expect(exam.patientId).toBe("test-patient-id");
    expect(exam.fileSize).toBe(100);
  });

  test("should create exam with generated id if no id is provided", () => {
    const examData: ExamDTO = {
      fileName: "exam.pdf",
      patientId: "test-patient-id",
      fileSize: 100,
    };

    const exam = new Exam(examData);

    expect(exam).toHaveProperty("id");
    expect(exam.fileName).toBe("exam.pdf");
    expect(exam.patientId).toBe("test-patient-id");
    expect(exam.fileSize).toBe(100);
  });

  test("should return correct examDTO from getDTO", () => {
    const examData: ExamDTO = {
      id: "exam-123",
      fileName: "exam.pdf",
      patientId: "test-patient-id",
      fileSize: 100,
    };

    const exam = new Exam(examData);
    const examDTO = exam.getDTO();

    expect(examDTO).toEqual({
      id: "exam-123",
      fileName: "exam.pdf",
      patientId: "test-patient-id",
      fileSize: 100,
    });
  });
});
