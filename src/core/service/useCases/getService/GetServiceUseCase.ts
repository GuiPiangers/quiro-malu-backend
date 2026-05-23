import { IServiceRepository } from '../../../../repositories/service/IServiceRepository'
import { ApiError } from '../../../../utils/ApiError'

export class GetServiceUseCase {
  constructor(private ServiceRepository: IServiceRepository) {}

  async execute({ id, clinicId }: { id: string; clinicId: string }) {
    const service = await this.ServiceRepository.get({ id, clinicId })
    if (!service) {
      throw new ApiError('Serviço não encontrado', 404, 'service')
    }
    return service
  }
}
