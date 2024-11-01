import { ApiError } from "../../../../utils/ApiError";
import { Progress, ProgressDTO } from "../Progress";

describe("Progress", () => {
  it("should create a Progress instance with valid data, including a valid DateTime", () => {
    const progressData: ProgressDTO = {
      id: "1",
      patientId: "patient-1",
      service: "Consultation",
      actualProblem: "Headache",
      date: "2023-12-01", // valid date
      procedures: "Consultation and tests",
    };

    const progress = new Progress(progressData);

    expect(progress.id).toBe(progressData.id);
    expect(progress.patientId).toBe(progressData.patientId);
    expect(progress.service).toBe(progressData.service);
    expect(progress.actualProblem).toBe(progressData.actualProblem);
    expect(progress.date?.date).toBe("2023-12-01"); // Verify DateTime date
    expect(progress.procedures).toBe(progressData.procedures);
  });

  it("should throw an error if date is invalid", () => {
    const invalidProgressData: ProgressDTO = {
      id: "2",
      patientId: "patient-2",
      service: "Consultation",
      actualProblem: "Fever",
      date: "invalid-date",
      procedures: null,
    };

    expect(() => new Progress(invalidProgressData)).toThrow(ApiError);
    expect(() => new Progress(invalidProgressData)).toThrow(
      "A data informada não é válida",
    );
  });

  it("should return correct DTO with date formatted correctly", () => {
    const progressData: ProgressDTO = {
      id: "4",
      patientId: "patient-4",
      service: "Check-up",
      actualProblem: "Routine check",
      date: "2023-11-01",
      procedures: "Blood test",
    };

    const progress = new Progress(progressData);

    const progressDTO = progress.getDTO();

    expect(progressDTO).toEqual({
      id: "4",
      patientId: "patient-4",
      service: "Check-up",
      actualProblem: "Routine check",
      date: "2023-11-01T00:00", // Expected DateTime format
      procedures: "Blood test",
    });
  });
});
