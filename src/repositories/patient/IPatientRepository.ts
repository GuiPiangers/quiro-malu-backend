import { PatientDTO } from '../../core/patients/models/Patient'

export interface IPatientRepository {
  save(patient: PatientDTO, clinicId: string): Promise<void>
  saveMany(patient: (PatientDTO & { clinicId: string })[]): Promise<void>
  update(data: PatientDTO, patientId: string, clinicId: string): Promise<void>
  getAll(
    clinicId: string,
    config: {
      limit: number
      offSet: number
      search?: { name?: string }
      orderBy?: { field: string; orientation: 'ASC' | 'DESC' }[]
    },
  ): Promise<PatientDTO[]>
  countAll(
    clinicId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]>
  getByCpf(cpf: string, clinicId: string): Promise<PatientDTO[]>
  /** Mês (1–12) e dia do mês (1–31) do aniversário, alinhado a `MONTH`/`DAY` em `dateOfBirth`. */
  getByBirthMonthAndDay(data: {
    birthMonth: number
    birthDay: number
    clinicId?: string
  }): Promise<(PatientDTO & { clinicId: string })[]>
  getByHash(hash: string, clinicId: string): Promise<PatientDTO | undefined>
  getById(patientId: string, clinicId: string): Promise<PatientDTO[]>
  delete(patientId: string, clinicId: string): Promise<void>

  getMostRecent(clinicId: string, limit: number): Promise<PatientDTO[]>
  listPatientsById(data: {
    clinicId: string
    patientIds: string[]
  }): Promise<PatientDTO[]>

  countPatientsOwnedByUser(data: {
    clinicId: string
    patientIds: string[]
  }): Promise<number>
}
