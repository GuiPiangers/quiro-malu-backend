import { StatusStrategy, StatusStrategyData } from "./StatusStrategy";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";

export default class ClientStatusStrategy implements StatusStrategy {
  calculateStatus({ scheduling, status }: StatusStrategyData) {
    if (!scheduling.date?.dateTime)
      throw new ApiError("A data deve ser definida para calcular o status");

    const now = DateTime.now();
    const difference = DateTime.difference(scheduling.date, now);

    if (difference < 0 && status === "Agendado") return "Atrasado";
    return status || "Agendado";
  }
}
