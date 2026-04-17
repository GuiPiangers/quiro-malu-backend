import { PatientDTO } from "../../../core/patients/models/Patient";
import { IPatientRepository } from "../IPatientRepository";

type InMemoryPatient = PatientDTO & {
  userId: string;
  createdAt: number;
};

export class InMemoryPatientRepository implements IPatientRepository {
  private dbPatients: InMemoryPatient[] = [];

  async getByBirthMonthAndDay(data: {
    birthMonth: number;
    birthDay: number;
    userId?: string;
  }): Promise<(PatientDTO & { userId: string })[]> {
    return this.dbPatients.filter((patient) => {
      if (data.userId && patient.userId !== data.userId) return false;
      if (!patient.dateOfBirth) return false;
      const m = `${patient.dateOfBirth}`.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return false;
      return (
        Number(m[2]) === data.birthMonth && Number(m[3]) === data.birthDay
      );
    });
  }

  async saveMany(patient: (PatientDTO & { userId: string })[]): Promise<void> {
    patient.forEach((p) => {
      this.dbPatients.push({ ...p, createdAt: Date.now() });
    });
  }

  async getByHash(hashData: string, userId: string): Promise<PatientDTO> {
    return this.dbPatients.find(
      (patient) => patient.userId === userId && patient.hashData === hashData,
    ) as PatientDTO;
  }

  async countAll(
    userId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]> {
    const total = this.dbPatients.filter((patient) => {
      if (patient.userId !== userId) return false;
      if (!search?.name) return true;
      return patient.name.includes(search.name);
    }).length;

    return [{ total }];
  }

  async delete(patientId: string, userId: string): Promise<void> {
    this.dbPatients = this.dbPatients.filter(
      (patient) => !(patient.id === patientId && patient.userId === userId),
    );
  }

  async update(data: PatientDTO, patientId: string, userId: string): Promise<void> {
    const index = this.dbPatients.findIndex((patient) => {
      return patient.userId === userId && patient.id === patientId;
    });

    if (index < 0) return;

    this.dbPatients[index] = {
      ...this.dbPatients[index],
      ...data,
    } as InMemoryPatient;
  }

  async getByCpf(cpf: string, userId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => {
      return patient.userId === userId && patient.cpf === cpf;
    });
  }

  async save(patient: PatientDTO, userId: string): Promise<void> {
    this.dbPatients.push({ ...patient, userId, createdAt: Date.now() });
  }

  async getAll(
    userId: string,
    config: {
      limit: number;
      offSet: number;
      search?: { name?: string };
      orderBy?: { field: string; orientation: "ASC" | "DESC" }[];
    },
  ): Promise<PatientDTO[]> {
    const list = this.dbPatients.filter((patient) => {
      if (patient.userId !== userId) return false;
      if (!config.search?.name) return true;
      return patient.name.includes(config.search.name);
    });

    return list.slice(config.offSet, config.offSet + config.limit);
  }

  async getById(id: string, userId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => {
      return patient.id === id && patient.userId === userId;
    });
  }

  async getMostRecent(userId: string, limit: number): Promise<PatientDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 0), 100);

    return this.dbPatients
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, safeLimit);
  }

  async getMostFrequent(userId: string, limit: number): Promise<PatientDTO[]> {
    return this.getMostRecent(userId, limit);
  }
}
