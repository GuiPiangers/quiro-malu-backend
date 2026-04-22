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

  async listIdsByUserId({ userId }: { userId: string }): Promise<string[]> {
    const now = Date.now();
    return this.dbSchedules
      .filter((s) => {
        if (s.userId !== userId || !s.date) return false;
        const t = new Date(s.date).getTime();
        return !Number.isNaN(t) && t > now;
      })
      .map((s) => s.id!)
      .filter(Boolean);
  }

  async listPatientIdsByUserIdOrderBySchedulingCountDesc(
    userId: string,
    limit: number,
  ): Promise<string[]> {
    const filtered = this.dbSchedules.filter((s) => {
      if (s.userId !== userId || !s.patientId) return false;
      if (s.status === "Cancelado") return false;
      return true;
    });

    const byPatient = new Map<
      string,
      { count: number; tieBreak: string }
    >();

    for (const s of filtered) {
      const pid = String(s.patientId);
      const cur = byPatient.get(pid) ?? { count: 0, tieBreak: "" };
      cur.count += 1;
      const schedCreated = s.createAt ? String(s.createAt) : "";
      if (schedCreated > cur.tieBreak) {
        cur.tieBreak = schedCreated;
      }
      byPatient.set(pid, cur);
    }

    const entries = [...byPatient.entries()].sort((a, b) => {
      if (b[1].count !== a[1].count) {
        return b[1].count - a[1].count;
      }
      const tie = b[1].tieBreak.localeCompare(a[1].tieBreak);
      if (tie !== 0) return tie;
      return b[0].localeCompare(a[0]);
    });

    return entries.slice(0, limit).map(([id]) => id);
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
