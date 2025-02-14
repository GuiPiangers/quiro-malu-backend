import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../Date";

describe("DateTime", () => {
  it("should create an instance when the date is valid", () => {
    const dateStr = "2024-11-01T10:30:00.000Z"; // Data fornecida pelo usuário
    const timezone = "Etc/UTC"; // Define o fuso horário como UTC
    const dateTime = new DateTime(dateStr, {}, timezone);

    expect(dateTime.dateTime).toMatch(/^2024-11-01T10:30$/);
  });

  it("should throw an ApiError when the date is invalid", () => {
    const invalidDateStr = "invalid-date";
    const invalidDateStr2 = "1999-00-00";
    const timezone = "Etc/UTC";

    expect(() => new DateTime(invalidDateStr, {}, timezone)).toThrow(ApiError);
    expect(() => new DateTime(invalidDateStr, {}, timezone)).toThrow(
      "A data informada não é válida",
    );
    expect(() => new DateTime(invalidDateStr2, {}, timezone)).toThrow(ApiError);
    expect(() => new DateTime(invalidDateStr2, {}, timezone)).toThrow(
      "A data informada não é válida",
    );
  });

  it("should throw an ApiError if onlyPassDate is true and date is in the future", () => {
    const futureDateStr = "2050-01-01T10:30:00.000Z";
    const timezone = "Etc/UTC";

    expect(
      () => new DateTime(futureDateStr, { onlyPassDate: true }, timezone),
    ).toThrow(ApiError);
    expect(
      () => new DateTime(futureDateStr, { onlyPassDate: true }, timezone),
    ).toThrow("A data informada precisa ser anterior a data atual");
  });

  it("should throw an ApiError if onlyFutureDate is true and date is in the past", () => {
    const pastDateStr = "2000-01-01T10:30:00.000Z";
    const timezone = "Etc/UTC";

    expect(
      () => new DateTime(pastDateStr, { onlyFutureDate: true }, timezone),
    ).toThrow(ApiError);
    expect(
      () => new DateTime(pastDateStr, { onlyFutureDate: true }, timezone),
    ).toThrow("A data informada precisa ser posterior a data atual");
  });

  it("should return the correct date and time from the value", () => {
    const dateStr = "2024-11-01T12:00:00.000Z";
    const timezone = "Etc/UTC";
    const dateTime = new DateTime(dateStr, {}, timezone);

    expect(dateTime.date).toBe("2024-11-01");
    expect(dateTime.time).toBe("12:00");
  });

  it("should handle timezone correctly", () => {
    const dateStr = "2024-11-01T10:30:00";
    const timezone = "Etc/UTC";
    const dateTime = new DateTime(dateStr, {}, timezone);

    expect(dateTime.dateTime).toMatch(/^2024-11-01T10:30$/);
  });
});
