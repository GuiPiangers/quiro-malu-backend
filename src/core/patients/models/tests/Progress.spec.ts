import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import { Progress, ProgressDTO } from "../Progress";

describe("Progress", () => {
  it("should create a Progress instance with valid data, including a valid DateTime", () => {
    const progressData: ProgressDTO = {
      id: "1",
      patientId: "patient-1",
      service: "Consultation",
      actualProblem: "Headache",
      date: "2023-12-01T00:00", // valid date
      procedures: "Consultation and tests",
      schedulingId: "schedulingId",
      painScales: [
        {
          painLevel: 5,
          description: "Headache",
        },
      ],
    };

    const progress = new Progress(progressData);

    expect(progress.id).toBe(progressData.id);
    expect(progress.patientId).toBe(progressData.patientId);
    expect(progress.service).toBe(progressData.service);
    expect(progress.actualProblem).toBe(progressData.actualProblem);
    expect(progress.date?.date).toBe("2023-12-01"); // Verify DateTime date
    expect(progress.procedures).toBe(progressData.procedures);
    expect(progress.schedulingId).toBe(progressData.schedulingId);
    expect(progress.painScales).toHaveLength(1);
  });

  it("should throw an error if date is invalid", () => {
    const invalidProgressData: ProgressDTO = {
      id: "2",
      patientId: "patient-2",
      service: "Consultation",
      actualProblem: "Fever",
      date: "invalid-date",
    };

    expect(() => new Progress(invalidProgressData)).toThrow(ApiError);
    expect(() => new Progress(invalidProgressData)).toThrow(
      "A data informada não é válida",
    );
  });

  it("should throw an error if painLevel is less than 0", () => {
    const progressData: ProgressDTO = {
      id: "1",
      patientId: "patient-1",
      service: "Consultation",
      actualProblem: "Headache",
      date: "2023-12-01T00:00",
      procedures: "Consultation and tests",
      schedulingId: "schedulingId",
      painScales: [
        {
          painLevel: -1,
          description: "Headache",
        },
      ],
    };

    expect(() => new Progress(progressData)).toThrow(ApiError);
    expect(() => new Progress(progressData)).toThrow(
      "O valor mínimo para a escala de dor é 0",
    );
  });

  it("should throw an error if painLevel is greater than 10", () => {
    const progressData: ProgressDTO = {
      id: "1",
      patientId: "patient-1",
      service: "Consultation",
      actualProblem: "Headache",
      date: "2023-12-01T00:00",
      procedures: "Consultation and tests",
      schedulingId: "schedulingId",
      painScales: [
        {
          painLevel: 11,
          description: "Headache",
        },
      ],
    };

    expect(() => new Progress(progressData)).toThrow(ApiError);
    expect(() => new Progress(progressData)).toThrow(
      "O valor máximo para a escala de dor é 10",
    );
  });

  it("should return correct DTO with date formatted correctly", () => {
    const progressData: ProgressDTO = {
      id: "4",
      patientId: "patient-4",
      service: "Check-up",
      actualProblem: "Routine check",
      date: new DateTime("2023-11-01T00:00").dateTime,
      procedures: "Blood test",
      schedulingId: "schedulingId",
      painScales: [
        {
          painLevel: 5,
          description: "Headache",
        },
      ],
    };

    const progress = new Progress(progressData);

    const progressDTO = progress.getDTO();

    expect(progressDTO).toEqual({
      id: "4",
      patientId: "patient-4",
      service: "Check-up",
      actualProblem: "Routine check",
      date: "2023-11-01T00:00",
      procedures: "Blood test",
      schedulingId: "schedulingId",
      painScales: [
        {
          painLevel: 5,
          description: "Headache",
        },
      ],
    });
  });
});
