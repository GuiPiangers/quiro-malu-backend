import { Service, ServiceDTO } from '../../models/Service'
import { IServiceRepository } from '../../../../repositories/service/IServiceRepository'
import { ApiError } from '../../../../utils/ApiError'

export class UpdateServiceUseCase {
  constructor(private ServiceRepository: IServiceRepository) {}

  async execute({ clinicId, ...data }: ServiceDTO & { clinicId: string }) {
    const service = new Service(data).getDTO()

    if (!data.id) throw new ApiError('O id deve ser informado', 400, 'service')

    const [verifyName] = await this.ServiceRepository.getByName({
      name: service.name,
      clinicId,
    })
    if (verifyName && verifyName.id !== data.id) {
      throw new ApiError(
        'Já existe um serviço cadastrado com esse nome',
        400,
        'service',
      )
    }

    await this.ServiceRepository.update({ clinicId, ...service })

    return service
  }
}
