import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";
import { ISchedulingRepository } from "./ISchedulingRepository";

interface inMemoryInterface extends SchedulingDTO {
    userId: string
}

export class InMemorySchedulingRepository implements ISchedulingRepository {
    count({ userId }: { userId: string }): Promise<[{ total: number; }]> {
        throw new Error("Method not implemented.");
    }
    delete({ }: { id: string, userId: string }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    private dbSchedules: inMemoryInterface[] = []

    async update({ userId, ...data }: SchedulingDTO & { userId: string }): Promise<void> {
        const index = this.dbSchedules.findIndex(Scheduling => {
            return Scheduling.userId === userId && Scheduling.id === data.id
        })
        this.dbSchedules[index] = { ...data, userId }
    }

    async save({ userId, ...data }: SchedulingDTO & { userId: string }): Promise<void> {
        this.dbSchedules.push({ ...data, userId })
    }

    async list({ userId }: { userId: string }): Promise<SchedulingDTO[]> {
        return this.dbSchedules.filter(Scheduling => Scheduling.userId === userId)
    }

    async get({ id, userId }: { id: string, userId: string }): Promise<SchedulingDTO[]> {
        return this.dbSchedules.filter(Scheduling => {
            return Scheduling.id === id && Scheduling.userId === userId
        })
    }
}