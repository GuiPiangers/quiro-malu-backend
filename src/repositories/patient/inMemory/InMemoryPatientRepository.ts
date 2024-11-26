import { PatientDTO } from "../../../core/patients/models/Patient";
import { IPatientRepository } from "../IPatientRepository";

interface inMemoryInterface extends PatientDTO {
  userId: string;
}

export class InMemoryPatientRepository implements IPatientRepository {
  saveMany(patient: (PatientDTO & { userId: string })[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getByHash(hash: string, userId: string): Promise<PatientDTO> {
    throw new Error("Method not implemented.");
  }

  private dbPatients: inMemoryInterface[] = [];

  async countAll(
    userId: string,
    search?: { name?: string | undefined } | undefined,
  ): Promise<[{ total: number }]> {
    const total = this.dbPatients.filter((patient) => {
      return (
        patient.userId === userId && (search ? patient.name === search : true)
      );
    }).length;
    return [{ total }];
  }

  async delete(patientId: string, userId: string): Promise<void> {
    this.dbPatients = this.dbPatients.filter(
      (patient) => patient.id === patientId && patient.userId === userId,
    );
  }

  async update(data: PatientDTO, userId: string): Promise<void> {
    const index = this.dbPatients.findIndex((patient) => {
      return patient.userId === userId && patient.id === data.id;
    });
    this.dbPatients[index] = { ...data, userId };
  }

  async getByCpf(cpf: string, userId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => {
      return patient.userId === userId && patient.cpf === cpf;
    });
  }

  async save(patient: PatientDTO, userId: string): Promise<void> {
    this.dbPatients.push({ ...patient, userId });
  }

  async getAll(userId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => patient.userId === userId);
  }

  async getById(id: string, userId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => {
      return patient.id === id && patient.userId === userId;
    });
  }
}
