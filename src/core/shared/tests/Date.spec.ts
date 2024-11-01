import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../Date";

describe("DateTime", () => {
  it("should create an instance when the date is valid", () => {
    const dateStr = "2024-11-01T10:30";
    const dateTime = new DateTime(dateStr);

    expect(dateTime.value).toMatch(/^2024-11-01T10:30$/);
  });

  it("should throw an ApiError when the date is invalid", () => {
    const invalidDateStr = "invalid-date";

    expect(() => new DateTime(invalidDateStr)).toThrow(ApiError);
    expect(() => new DateTime(invalidDateStr)).toThrow(
      "A data informada não é válida",
    );
  });

  it("should throw an ApiError if onlyPassDate is true and date is in the future", () => {
    const futureDateStr = "2050-01-01T10:30";

    expect(() => new DateTime(futureDateStr, { onlyPassDate: true })).toThrow(
      ApiError,
    );
    expect(() => new DateTime(futureDateStr, { onlyPassDate: true })).toThrow(
      "A data informada precisa ser anterior a data atual",
    );
  });

  it("should throw an ApiError if onlyFutureDate is true and date is in the past", () => {
    const pastDateStr = "2000-01-01T10:30";

    expect(() => new DateTime(pastDateStr, { onlyFutureDate: true })).toThrow(
      ApiError,
    );
    expect(() => new DateTime(pastDateStr, { onlyFutureDate: true })).toThrow(
      "A data informada precisa ser posterior a data atual",
    );
  });

  it("should return the correct date and time from the value", () => {
    const dateStr = "2024-11-01T12:00";
    const dateTime = new DateTime(dateStr);

    expect(dateTime.date).toBe("2024-11-01");
    expect(dateTime.time).toBe("12:00");
  });
});
