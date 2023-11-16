import { ProgressDTO } from "../../core/patients/models/Progress";

export interface IProgressRepository {
    save(data: ProgressDTO, userId: string): Promise<void>;
    update(data: ProgressDTO, userId: string): Promise<void>
    get(id: string, patientId: string, userId: string): Promise<ProgressDTO[]>
    list(patientId: string, userId: string): Promise<ProgressDTO[]>
    delete(id: string, patientId: string, userId: string): Promise<void>
}
