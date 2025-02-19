import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";
import { SchedulingWithPatientDTO } from "../../core/scheduling/models/SchedulingWithPatient";

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
  }): Promise<SchedulingWithPatientDTO[]>;

  count(data: { userId: string; date: string }): Promise<[{ total: number }]>;

  qdtSchedulesByDay(data: {
    month: number;
    year: number;
    userId: string;
  }): Promise<{ formattedDate: string; qtd: number }[]>;

  get(data: {
    id: string;
    userId: string;
  }): Promise<SchedulingWithPatientDTO[]>;

  delete(data: { id: string; userId: string }): Promise<void>;
}
