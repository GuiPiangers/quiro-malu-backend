import type { Clinician } from "./models/Clinician";
import type { ServiceDTO } from "../service/models/Service";

export type ClinicianPublicDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clinicId: string;
  roleId?: string;
  services: ServiceDTO[];
};

export function toClinicianPublicDTO(clinician: Clinician): ClinicianPublicDTO {
  const dto = clinician.toClinicianDTO();
  return {
    id: clinician.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    clinicId: dto.clinicId,
    roleId: dto.roleId,
    services: dto.services ?? [],
  };
}
