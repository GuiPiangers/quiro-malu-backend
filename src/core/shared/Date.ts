import { TZDate } from "@date-fns/tz";
import { ApiError } from "../../utils/ApiError";

type DateTimeConfig = {
  onlyPassDate?: boolean;
  onlyFutureDate?: boolean;
};

export class DateTime {
  readonly dateTime: string;
  readonly timezone: string;
  readonly value: Date;

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

    this.dateTime = `${dateStr.substring(0, 16)}`;
    this.value = new Date(dateStr);
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
    return this.dateTime.substring(0, 10);
  }

  get time(): string {
    return this.dateTime.substring(11, 16);
  }

  static toIsoDate(date: string) {
    return date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
  }

  static toLocaleDate(date: string) {
    return date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
  }

  static now(props: DateTimeConfig = {}) {
    return new DateTime(new Date().toISOString(), props);
  }

  static difference(date1: DateTime, date2: DateTime) {
    return date1.value.getTime() - date2.value.getTime();
  }
}
