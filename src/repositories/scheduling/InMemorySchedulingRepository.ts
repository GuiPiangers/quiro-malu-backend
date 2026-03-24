import {
  Scheduling,
  SchedulingDTO,
} from "../../core/scheduling/models/Scheduling";
import { SchedulingWithPatientDTO } from "../../core/scheduling/models/SchedulingWithPatient";
import { DateTime } from "../../core/shared/Date";
import {
  ISchedulingRepository,
  ListBetweenDatesParams,
  UpdateSchedulingParams,
} from "./ISchedulingRepository";

type InMemorySchedule = SchedulingWithPatientDTO & {
  userId: string;
};

export class InMemorySchedulingRepository implements ISchedulingRepository {
  private dbSchedules: InMemorySchedule[] = [];

  async listBetweenDates(data: ListBetweenDatesParams): Promise<Scheduling[]> {
    return this.dbSchedules
      .filter((s) => s.userId === data.userId)
      .map((s) => new Scheduling(s));
  }

  async qdtSchedulesByDay(data: {
    month: number;
    year: number;
    userId: string;
  }): Promise<{ formattedDate: string; qtd: number }[]> {
    return [];
  }

  async count(data: { userId: string; date: string }): Promise<[{ total: number }]> {
    const total = this.dbSchedules.filter((s) => {
      if (s.userId !== data.userId) return false;
      if (!s.date) return false;
      return String(s.date).substring(0, 10) === data.date;
    }).length;

    return [{ total }];
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    this.dbSchedules = this.dbSchedules.filter(
      (scheduling) => !(scheduling.id === id && scheduling.userId === userId),
    );
  }

  async update({ userId, ...data }: UpdateSchedulingParams): Promise<void> {
    const index = this.dbSchedules.findIndex((scheduling) => {
      return scheduling.userId === userId && scheduling.id === data.id;
    });

    if (index === -1) return;

    this.dbSchedules[index] = {
      ...(this.dbSchedules[index] as InMemorySchedule),
      ...(data as any),
      userId,
    };
  }

  async save({
    userId,
    ...data
  }: SchedulingDTO & { userId: string }): Promise<void> {
    this.dbSchedules.push({
      ...(data as any),
      userId,
      patient: "",
      phone: "",
    });
  }

  async list(data: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<SchedulingWithPatientDTO[]> {
    const list = this.dbSchedules.filter((scheduling) => {
      if (scheduling.userId !== data.userId) return false;
      if (!scheduling.date) return false;
      return String(scheduling.date).substring(0, 10) === data.date;
    });

    if (!data.config) return list;

    return list.slice(data.config.offSet, data.config.offSet + data.config.limit);
  }

  async get(data: {
    id: string;
    userId: string;
  }): Promise<SchedulingWithPatientDTO[]> {
    return this.dbSchedules.filter(
      (scheduling) => scheduling.id === data.id && scheduling.userId === data.userId,
    );
  }

  async listFromNowWithinMinutes(data: {
    userId: string;
    offsetMinutes: number;
  }): Promise<Scheduling[]> {
    return [];
  }

  async listScheduledInMinutes(data: {
    userId: string;
    offsetMinutes: number;
  }): Promise<Scheduling[]> {
    return [];
  }

  async listUpcoming(data: {
    userId: string;
    windowMinutes: number;
  }): Promise<Scheduling[]> {
    return [];
  }
}
