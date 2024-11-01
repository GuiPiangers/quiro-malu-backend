import { DateTime } from "../../../shared/Date";
import { StatusStrategy, StatusStrategyData } from "./StatusStrategy";

export default class ClientStatusStrategy implements StatusStrategy {
  calculateStatus({ scheduling, status }: StatusStrategyData) {
    const date = new DateTime(new Date().toString());

    if (scheduling.date < date && status === "Agendado") return "Atrasado";

    return scheduling.status || "Agendado";
  }
}
