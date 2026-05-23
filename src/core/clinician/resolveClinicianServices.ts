import type { ServiceDTO } from '../service/models/Service'
import type { IServiceRepository } from '../../repositories/service/IServiceRepository'
import { ApiError } from '../../utils/ApiError'

export async function resolveClinicianServices(
  serviceRepository: IServiceRepository,
  serviceRefs: { serviceId: string }[],
  clinicId: string,
): Promise<ServiceDTO[]> {
  const uniqueServiceIds = [...new Set(serviceRefs.map((ref) => ref.serviceId))]

  const lookups = await Promise.all(
    uniqueServiceIds.map(async (serviceId) => ({
      serviceId,
      service: await serviceRepository.get({ id: serviceId, clinicId }),
    })),
  )

  const resolved: ServiceDTO[] = []
  for (const { serviceId, service } of lookups) {
    if (!service) {
      throw new ApiError(
        `Serviço não encontrado na clínica: ${serviceId}`,
        400,
        'services',
      )
    }
    resolved.push(service)
  }
  return resolved
}
