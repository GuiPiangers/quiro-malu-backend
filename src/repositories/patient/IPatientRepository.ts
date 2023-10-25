import { PatientDTO } from "../../models/entities/Patient";

export interface IPatientRepository {
    save(patient: PatientDTO, userId: string): Promise<void>;
    update(data: PatientDTO, patientId: string, userId: string): Promise<void>
    getAll(userId: string): Promise<PatientDTO[]>
    getByCpf(cpf: string, userId: string): Promise<PatientDTO[]>
    getById(patientId: string, userId: string): Promise<PatientDTO[]>;
}
