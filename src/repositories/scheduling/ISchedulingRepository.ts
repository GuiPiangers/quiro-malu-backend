import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";

export interface ISchedulingRepository {
    save(data: SchedulingDTO & { userId: string }): Promise<void>;
    update({ userId, id, ...data }: SchedulingDTO & { userId: string, id: string }): Promise<void>
    list(data: { patientId: string, userId: string, config?: { limit: number, offSet: number } }): Promise<SchedulingDTO[]>
    count({ userId }: { patientId: string, userId: string }): Promise<[{ total: number }]>
    get(data: { id: string, patientId: string, userId: string }): Promise<SchedulingDTO[]>;
    delete(data: { id: string, patientId: string, userId: string }): Promise<void>
}
