import type { ClinicianPublicDTO } from '../../clinicianPublicDto'
import { toClinicianPublicDTO } from '../../clinicianPublicDto'
import { resolveClinicianServices } from '../../resolveClinicianServices'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import type { IServiceRepository } from '../../../../repositories/service/IServiceRepository'
import { ApiError } from '../../../../utils/ApiError'

export type SetClinicianServicesInputDTO = {
  clinicianId: string;
  services: { serviceId: string }[];
}

export class SetClinicianServicesUseCase {
  constructor(
    private readonly clinicianRepository: IClinicianRepository,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(
    data: SetClinicianServicesInputDTO,
    clinicId: string,
  ): Promise<ClinicianPublicDTO> {
    const clinician = await this.clinicianRepository.findById({
      id: data.clinicianId,
      clinicId,
    })
    if (!clinician) {
      throw new ApiError('Clínico não encontrado', 404, 'clinician')
    }

    const resolvedServices = await resolveClinicianServices(
      this.serviceRepository,
      data.services,
      clinicId,
    )

    await this.clinicianRepository.setServices({
      id: data.clinicianId,
      clinicId,
      services: resolvedServices,
    })

    const updated = await this.clinicianRepository.findById({
      id: data.clinicianId,
      clinicId,
    })
    if (!updated) {
      throw new ApiError('Clínico não encontrado', 404, 'clinician')
    }

    return toClinicianPublicDTO(updated)
  }
}
