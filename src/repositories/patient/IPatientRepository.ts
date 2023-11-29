import { PatientDTO } from "../../core/patients/models/Patient";

export interface IPatientRepository {
    save(patient: PatientDTO, userId: string): Promise<void>;
    update(data: PatientDTO, patientId: string, userId: string): Promise<void>
    getAll(userId: string, config: {
        limit: number,
        offSet: number,
        search?: { name?: string }
        orderBy?: { field: string, orientation: 'ASC' | 'DESC' }[]
    }): Promise<PatientDTO[]>
    countAll(userId: string, search?: { name?: string }): Promise<[{ total: number }]>
    getByCpf(cpf: string, userId: string): Promise<PatientDTO[]>
    getById(patientId: string, userId: string): Promise<PatientDTO[]>;
    delete(patientId: string, userId: string): Promise<void>
}
