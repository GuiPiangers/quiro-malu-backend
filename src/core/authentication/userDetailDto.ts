import { toClinicianPublicDTO } from "../clinician/clinicianPublicDto";
import type { Clinician } from "../clinician/models/Clinician";
import type { ServiceDTO } from "../service/models/Service";
import { toUserPublicDTO } from "./userPublicDto";
import type { UserDTO } from "./models/User";

export type UserDetailBase = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clinicId: string;
  roleId: string | null;
};

export type StandardUserDetailDTO = UserDetailBase & {
  kind: "user";
};

export type ClinicianUserDetailDTO = UserDetailBase & {
  kind: "clinician";
  services: ServiceDTO[];
};

export type UserDetailDTO = StandardUserDetailDTO | ClinicianUserDetailDTO;

export function toStandardUserDetail(user: UserDTO): StandardUserDetailDTO {
  return {
    kind: "user",
    ...toUserPublicDTO(user),
  };
}

export function toClinicianUserDetail(clinician: Clinician): ClinicianUserDetailDTO {
  const publicDto = toClinicianPublicDTO(clinician);
  return {
    kind: "clinician",
    id: publicDto.id,
    name: publicDto.name,
    email: publicDto.email,
    phone: publicDto.phone,
    clinicId: publicDto.clinicId,
    roleId: publicDto.roleId ?? null,
    services: publicDto.services,
  };
}
