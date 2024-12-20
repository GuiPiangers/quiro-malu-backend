import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";

export type UpdateSchedulingParams = Partial<SchedulingDTO> & {
  userId: string;
  id: string;
};

export interface ISchedulingRepository {
  save(data: SchedulingDTO & { userId: string }): Promise<void>;

  update(data: UpdateSchedulingParams): Promise<void>;

  list(data: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<(SchedulingDTO & { patient: string; phone: string })[]>;

  count(data: { userId: string; date: string }): Promise<[{ total: number }]>;

  qdtSchedulesByDay(data: {
    month: number;
    year: number;
    userId: string;
  }): Promise<{ formattedDate: string; qtd: number }[]>;

  get(data: { id: string; userId: string }): Promise<SchedulingDTO[]>;

  delete(data: { id: string; userId: string }): Promise<void>;
}
