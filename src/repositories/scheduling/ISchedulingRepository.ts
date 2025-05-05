import {
  Scheduling,
  SchedulingDTO,
} from "../../core/scheduling/models/Scheduling";
import { SchedulingWithPatientDTO } from "../../core/scheduling/models/SchedulingWithPatient";
import { DateTime } from "../../core/shared/Date";

export type UpdateSchedulingParams = Partial<SchedulingDTO> & {
  userId: string;
  id: string;
};

export type ListBetweenDatesParams = {
  userId: string;
  startDate: DateTime;
  endDate: DateTime;
};

export interface ISchedulingRepository {
  save(data: SchedulingDTO & { userId: string }): Promise<void>;

  update(data: UpdateSchedulingParams): Promise<void>;

  list(data: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<SchedulingWithPatientDTO[]>;

  listBetweenDates(data: ListBetweenDatesParams): Promise<Scheduling[]>;

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
