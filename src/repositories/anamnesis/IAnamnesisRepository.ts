import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";

export interface IAnamnesisRepository {
  save(data: AnamnesisDTO, userId: string): Promise<void>;
  update(data: AnamnesisDTO, userId: string): Promise<void>;
  get(patientId: string, userId: string): Promise<AnamnesisDTO[]>;
}
