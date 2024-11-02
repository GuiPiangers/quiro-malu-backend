import { format } from "date-fns";
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
    const now = new Date();

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

    const zonedDate = new TZDate(utcDate, this.timezone);
    const dateValue = format(zonedDate, "yyyy-MM-dd");
    const timeValue = format(zonedDate, "HH:mm");

    this.value = `${dateValue}T${timeValue}`;
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  get date(): string {
    return this.value.substring(0, 10);
  }

  get time(): string {
    return this.value.substring(11, 16);
  }
}
