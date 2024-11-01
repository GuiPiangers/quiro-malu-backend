import { StatusStrategy, StatusStrategyData } from "./StatusStrategy";

export default class DatabaseStatusStrategy implements StatusStrategy {
  calculateStatus({ status }: StatusStrategyData) {
    return status || "Agendado";
  }
}
