import { Clinician } from '../../core/clinician/models/Clinician'
import type { ServiceDTO } from '../../core/service/models/Service'

export type ClinicianFindByIdParams = {
  id: string
  clinicId: string
}

export type SetClinicianServicesParams = ClinicianFindByIdParams & {
  services: ServiceDTO[]
}

export interface IClinicianRepository {
  findById(params: ClinicianFindByIdParams): Promise<Clinician | null>
  findByClinic(params: { clinicId: string }): Promise<Clinician[]>
  save(clinician: Clinician): Promise<void>
  /** Substitui todos os vínculos em `clinician_services` do clínico. */
  setServices(params: SetClinicianServicesParams): Promise<void>
}
