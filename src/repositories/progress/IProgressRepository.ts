import { ProgressDTO } from '../../core/patients/models/Progress'

export interface IProgressRepository {
  save(data: ProgressDTO & { clinicId: string }): Promise<void>;
  update(data: ProgressDTO & { clinicId: string }): Promise<void>;
  get(data: {
    id: string;
    patientId: string;
    clinicId: string;
  }): Promise<ProgressDTO[]>;

  getByScheduling(data: {
    schedulingId: string;
    patientId: string;
    clinicId: string;
  }): Promise<ProgressDTO[]>;

  list(data: {
    patientId: string;
    clinicId: string;
    config?: { limit: number; offSet: number };
  }): Promise<ProgressDTO[]>;

  count(data: {
    patientId: string;
    clinicId: string;
  }): Promise<[{ total: number }]>;

  delete(data: {
    id: string;
    patientId: string;
    clinicId: string;
  }): Promise<void>;
}
