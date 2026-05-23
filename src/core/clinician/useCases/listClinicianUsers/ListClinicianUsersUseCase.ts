import {
  toClinicianPublicDTO,
  type ClinicianPublicDTO,
} from '../../clinicianPublicDto'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'

export type ListClinicianUsersResult = {
  result: ClinicianPublicDTO[]
}

export class ListClinicianUsersUseCase {
  constructor(private readonly clinicianRepository: IClinicianRepository) {}

  async execute(clinicId: string): Promise<ListClinicianUsersResult> {
    const clinicians = await this.clinicianRepository.findByClinic({ clinicId })
    return { result: clinicians.map(toClinicianPublicDTO) }
  }
}
