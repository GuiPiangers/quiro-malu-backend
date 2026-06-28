import type { Clinician } from './models/Clinician'
import type { ServiceDTO } from '../service/models/Service'
import { UserStatus } from '../authentication/models/User'

export type ClinicianPublicDTO = {
  id: string
  name: string
  email: string
  phone: string
  clinicId: string
  roleId?: string
  status?: UserStatus
  services: ServiceDTO[]
}

export function toClinicianPublicDTO(clinician: Clinician): ClinicianPublicDTO {
  const dto = clinician.toClinicianDTO()
  return {
    id: clinician.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    clinicId: dto.clinicId,
    roleId: dto.roleId,
    status: dto.status,
    services: dto.services ?? [],
  }
}
