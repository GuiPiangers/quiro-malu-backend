import { toClinicianPublicDTO, type ClinicianPublicDTO } from "../../clinicianPublicDto";
import type { IClinicianRepository } from "../../../../repositories/clinician/IClinicianRepository";

export class ListClinicianUsersUseCase {
  constructor(private readonly clinicianRepository: IClinicianRepository) {}

  async execute(clinicId: string): Promise<ClinicianPublicDTO[]> {
    const clinicians = await this.clinicianRepository.findByClinic({ clinicId });
    return clinicians.map(toClinicianPublicDTO);
  }
}
