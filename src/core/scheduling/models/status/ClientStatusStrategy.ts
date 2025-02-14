import { TZDate } from "@date-fns/tz";
import { StatusStrategy, StatusStrategyData } from "./StatusStrategy";
import { ApiError } from "../../../../utils/ApiError";

export default class ClientStatusStrategy implements StatusStrategy {
  calculateStatus({ scheduling, status }: StatusStrategyData) {
    if (!scheduling.date?.dateTime)
      throw new ApiError("A data deve ser definida para calcular o status");

    const date = new TZDate(new Date(), "Etc/UTC");
    const schedulingDate = new TZDate(scheduling.date?.dateTime, "Etc/UTC");

    if (schedulingDate < date && status === "Agendado") return "Atrasado";
    return status || "Agendado";
  }
}
