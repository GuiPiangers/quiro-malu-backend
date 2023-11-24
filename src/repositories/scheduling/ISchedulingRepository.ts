import { SchedulingDTO } from "../../core/scheduling/models/Scheduling";

export interface ISchedulingRepository {
    save(data: SchedulingDTO & { userId: string }): Promise<void>;
    update(data: SchedulingDTO & { userId: string, id: string }): Promise<void>
    list(data: { userId: string, date: string, config?: { limit: number, offSet: number } }): Promise<SchedulingDTO[]>
    count(data: { userId: string, date: string }): Promise<[{ total: number }]>
    get(data: { id: string, patientId: string, userId: string }): Promise<SchedulingDTO[]>;
    delete(data: { id: string, patientId: string, userId: string }): Promise<void>
}
