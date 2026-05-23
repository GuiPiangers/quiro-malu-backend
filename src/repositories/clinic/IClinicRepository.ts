import { Clinic } from '../../core/clinics/models/Clinic'

export interface IClinicRepository {
  save(clinic: Clinic): Promise<Clinic>
  findById(id: string): Promise<Clinic | null>
  findByName(name: string): Promise<Clinic | null>
}
