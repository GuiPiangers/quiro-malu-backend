import { PatientDTO } from "../../core/patients/models/Patient";

export interface IPatientRepository {
  save(patient: PatientDTO, userId: string): Promise<void>;
  saveMany(patient: (PatientDTO & { userId: string })[]): Promise<void>;
  update(data: PatientDTO, patientId: string, userId: string): Promise<void>;
  getAll(
    userId: string,
    config: {
      limit: number;
      offSet: number;
      search?: { name?: string };
      orderBy?: { field: string; orientation: "ASC" | "DESC" }[];
    },
  ): Promise<PatientDTO[]>;
  countAll(
    userId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]>;
  getByCpf(cpf: string, userId: string): Promise<PatientDTO[]>;
  /** Mês (1–12) e dia do mês (1–31) do aniversário, alinhado a `MONTH`/`DAY` em `dateOfBirth`. */
  getByBirthMonthAndDay(data: {
    birthMonth: number;
    birthDay: number;
    userId?: string;
  }): Promise<(PatientDTO & { userId: string })[]>;
  getByHash(hash: string, userId: string): Promise<PatientDTO | undefined>;
  getById(patientId: string, userId: string): Promise<PatientDTO[]>;
  delete(patientId: string, userId: string): Promise<void>;

  getMostRecent(userId: string, limit: number): Promise<PatientDTO[]>;
  getMostFrequent(userId: string, limit: number): Promise<PatientDTO[]>;

  countPatientsOwnedByUser(data: {
    userId: string;
    patientIds: string[];
  }): Promise<number>;
}
