import { PatientDTO } from "../../core/patients/models/Patient";
import { query } from "../server/mySqlConnection";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";

export class MySqlPatientRepository implements IPatientRepository {
    save(data: PatientDTO, userId: string): Promise<void> {
        const sql = "INSERT INTO patients SET ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, { ...data, userId: userId })
    }
    update(data: PatientDTO, patientId: string, userId: string): Promise<void> {
        const sql = "UPDATE patients SET ? WHERE id = ? and userId = ?"
        const errorMessage = "Falha ao adicionar o usuário"

        return query(errorMessage, sql, [data, patientId, userId])
    }
    getAll(userId: string): Promise<PatientDTO[]> {
        const sql = "SELECT name, phone, id, dateOfBirth  FROM patients WHERE userId = ? ORDER BY updateAt DESC"
        const errorMessage = `Não foi possível realizar a busca`
        return query(errorMessage, sql, [userId])
    }
    getByCpf(cpf: string, userId: string): Promise<PatientDTO[]> {
        const sql = "SELECT * FROM patients WHERE cpf = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [cpf, userId])
    }
    getById(patientId: string, userId: string): Promise<PatientDTO[]> {
        const sql = "SELECT * FROM patients WHERE id = ? AND userId = ?"
        const errorMessage = `Não foi possível realizar a busca`

        return query(errorMessage, sql, [patientId, userId])
    }
    delete(patientId: string, userId: string): Promise<void> {
        const sql = "DELETE FROM patients WHERE id = ? AND userId = ?"
        const errorMessage = `Não foi possível deletar o paciente`

        return query(errorMessage, sql, [patientId, userId])
    }

}