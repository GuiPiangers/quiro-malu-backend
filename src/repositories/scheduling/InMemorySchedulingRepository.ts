import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";
import {
  ISchedulingRepository,
  UpdateSchedulingParams,
} from "./ISchedulingRepository";

interface inMemoryInterface extends SchedulingDTO {
  userId: string;
}

export class InMemorySchedulingRepository implements ISchedulingRepository {
  private dbSchedules: inMemoryInterface[] = [];

  qdtSchedulesByDay(data: {
    month: number;
    year: number;
    userId: string;
  }): Promise<{ formattedDate: string; qtd: number }[]> {
    throw new Error("Method not implemented.");
  }

  count({ userId }: { userId: string }): Promise<[{ total: number }]> {
    throw new Error("Method not implemented.");
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    this.dbSchedules = this.dbSchedules.filter(
      (Scheduling) => Scheduling.id !== id && Scheduling.userId === userId,
    );
    return Promise.resolve();
  }

  async update({ userId, ...data }: UpdateSchedulingParams): Promise<void> {
    const index = this.dbSchedules.findIndex((Scheduling) => {
      return Scheduling.userId === userId && Scheduling.id === data.id;
    });
    if (index !== -1) {
      this.dbSchedules[index] = { ...data, userId } as inMemoryInterface;
    }
  }

  async save({
    userId,
    ...data
  }: SchedulingDTO & { userId: string }): Promise<void> {
    this.dbSchedules.push({ ...data, userId });
  }

  async list({
    userId,
  }: {
    userId: string;
  }): Promise<(SchedulingDTO & { patient: string; phone: string })[]> {
    return this.dbSchedules
      .filter((scheduling) => scheduling.userId === userId)
      .map(({ patient, phone, ...rest }) => ({
        ...rest,
        patient: patient ?? "",
        phone: phone ?? "",
      }));
  }

  async get({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<SchedulingDTO[]> {
    return this.dbSchedules.filter((Scheduling) => {
      return Scheduling.id === id && Scheduling.userId === userId;
    });
  }
}
