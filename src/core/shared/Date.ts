import { TZDate } from "@date-fns/tz";
import { ApiError } from "../../utils/ApiError";

type DateTimeConfig = {
  onlyPassDate?: boolean;
  onlyFutureDate?: boolean;
};

export class DateTime {
  readonly value: string;
  readonly timezone: string;

  constructor(
    dateStr: string,
    { onlyPassDate, onlyFutureDate }: DateTimeConfig = {},
    timezone = "America/Sao_Paulo",
  ) {
    this.timezone = timezone;

    if (!this.isValidDate(dateStr)) {
      throw new ApiError("A data informada não é válida", 400, "date");
    }

    const utcDate = new TZDate(dateStr, "Etc/UTC");
    const now = new TZDate(new Date(), "Etc/UTC");

    if (onlyPassDate && !onlyFutureDate) {
      if (utcDate > now) {
        throw new ApiError(
          "A data informada precisa ser anterior a data atual",
          400,
          "date",
        );
      }
    }
    if (onlyFutureDate && !onlyPassDate) {
      if (utcDate < now) {
        throw new ApiError(
          "A data informada precisa ser posterior a data atual",
          400,
          "date",
        );
      }
    }

    this.value = `${dateStr.substring(0, 16)}`;
  }

  private isValidDate(dateString: string): boolean {
    const regexDate = /^(\d{4}-\d{2}-\d{2})/;
    const regexTime = /T(\d{2}:\d{2})/;
    const onlyDateValue =
      regexDate.test(dateString) && !regexTime.test(dateString);
    const regexPattern = new RegExp(regexDate.source + regexTime.source);

    const date = new Date(dateString);
    const isValidDate = date instanceof Date && !isNaN(+date);
    if (!isValidDate) return false;

    if (onlyDateValue) {
      return true;
    }
    return regexPattern.test(dateString);
  }

  get date(): string {
    return this.value.substring(0, 10);
  }

  get time(): string {
    return this.value.substring(11, 16);
  }
}
