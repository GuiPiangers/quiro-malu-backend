import { Scheduling, SchedulingStatus } from "../Scheduling";

export type StatusStrategyData = {
  scheduling: Scheduling;
  status?: SchedulingStatus | null;
};

export interface StatusStrategy {
  calculateStatus(data: StatusStrategyData): SchedulingStatus;
}
