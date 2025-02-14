import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../Date";

describe("DateTime", () => {
  describe("instantiation", () => {
    it("should create an instance when the date is valid", () => {
      const dateStr = "2024-11-01T10:30:00.000Z";
      const timezone = "Etc/UTC";
      const dateTime = new DateTime(dateStr, {}, timezone);

      expect(dateTime.dateTime).toMatch(/^2024-11-01T10:30$/);
    });

    it("should throw an ApiError when the date is invalid", () => {
      const invalidDateStr = "invalid-date";
      const invalidDateStr2 = "1999-00-00";
      const timezone = "Etc/UTC";

      expect(() => new DateTime(invalidDateStr, {}, timezone)).toThrow(
        ApiError,
      );
      expect(() => new DateTime(invalidDateStr, {}, timezone)).toThrow(
        "A data informada não é válida",
      );
      expect(() => new DateTime(invalidDateStr2, {}, timezone)).toThrow(
        ApiError,
      );
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

    it("should return the correct attributes date, time, dateTime and value", () => {
      const dateStr = "2024-11-01T12:00:00.000Z";
      const timezone = "Etc/UTC";
      const date = new DateTime(dateStr, {}, timezone);

      expect(date.date).toBe("2024-11-01");
      expect(date.time).toBe("12:00");
      expect(date.dateTime).toBe("2024-11-01T12:00");
      expect(date.value).toBeInstanceOf(Date);
      expect(date.value.toISOString()).toBe(dateStr);
    });

    it("should handle timezone correctly", () => {
      const dateStr = "2024-11-01T10:30:00";
      const timezone = "Etc/UTC";
      const dateTime = new DateTime(dateStr, {}, timezone);

      expect(dateTime.dateTime).toMatch(/^2024-11-01T10:30$/);
    });

    it("should create DataTime with only date", () => {
      const dateStr = "2024-11-01";
      const dateTime = new DateTime(dateStr);

      expect(dateTime).toBeInstanceOf(DateTime);
      expect(dateTime.dateTime).toBe("2024-11-01");
    });
  });

  describe("now", () => {
    beforeAll(() => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
    });
    it("should return new DateTime instance with current date and time", () => {
      const nowDateTime = DateTime.now();

      expect(nowDateTime).toBeInstanceOf(DateTime);
      expect(nowDateTime.date).toBe("2025-01-10");
      expect(nowDateTime.time).toBe("12:00");
      expect(nowDateTime.dateTime).toBe("2025-01-10T12:00");
    });
  });

  describe("difference", () => {
    it("should return new DateTime instance with current date and time", () => {
      const date1 = new DateTime("2025-01-11T12:00");
      const date2 = new DateTime("2025-01-10T12:00");

      const dateDifference = DateTime.difference(date1, date2);

      expect(dateDifference).toBe(3600000 * 24);
    });
  });

  describe("toIsoDate", () => {
    it("should return new DateTime instance with current date and time", () => {
      const date1 = "10/01/2025";

      const isoDate = DateTime.toIsoDate(date1);

      expect(isoDate).toBe("2025-01-10");
    });
  });
});
