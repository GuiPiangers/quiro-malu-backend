import { StatusStrategy, StatusStrategyData } from "./StatusStrategy";

export default class DatabaseStatusStrategy implements StatusStrategy {
  calculateStatus({ status }: StatusStrategyData) {
    if (status === "Atrasado") return "Agendado";
    return status || "Agendado";
  }
}
