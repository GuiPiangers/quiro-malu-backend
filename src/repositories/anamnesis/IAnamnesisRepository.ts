import { AnamnesisDTO } from '../../core/patients/models/Anamnesis'

export interface IAnamnesisRepository {
  save(data: AnamnesisDTO, clinicId: string): Promise<void>
  saveMany(data: (AnamnesisDTO & { clinicId: string })[]): Promise<void>
  update(data: AnamnesisDTO, clinicId: string): Promise<void>
  get(patientId: string, clinicId: string): Promise<AnamnesisDTO>
}
