import { TZDate } from "@date-fns/tz";
import { DateTime } from "../../../shared/Date";
import { StatusStrategy, StatusStrategyData } from "./StatusStrategy";

export default class ClientStatusStrategy implements StatusStrategy {
  calculateStatus({ scheduling, status }: StatusStrategyData) {
    const date = new TZDate(new Date(), "Etc/UTC");
    const schedulingDate = new TZDate(scheduling.date.value, "Etc/UTC");
    if (schedulingDate < date && status === "Agendado") return "Atrasado";
    return status || "Agendado";
  }
}
