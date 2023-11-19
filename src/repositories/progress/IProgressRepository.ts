import { ProgressDTO } from "../../core/patients/models/Progress";

export interface IProgressRepository {
    save(data: ProgressDTO & { userId: string }): Promise<void>;
    update(data: ProgressDTO & { userId: string }): Promise<void>
    get(data: { id: string, patientId: string, userId: string }): Promise<ProgressDTO[]>
    list(data: { patientId: string, userId: string }): Promise<ProgressDTO[]>
    delete(data: { id: string, patientId: string, userId: string }): Promise<void>
}
