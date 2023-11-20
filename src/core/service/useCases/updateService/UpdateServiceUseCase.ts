import { Service, ServiceDTO } from "../../models/Service";
import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";
import { ApiError } from "../../../../utils/ApiError";

export class UpdateServiceUseCase {
  constructor(private ServiceRepository: IServiceRepository) { }

  async execute({ userId, ...data }: ServiceDTO & { userId: string }) {
    const service = new Service(data).getDTO()

    if (!data.id) throw new ApiError('O id deve ser informado', 400, 'service')

    const [verifyName] = await this.ServiceRepository.getByName({ name: service.name, userId })
    if (verifyName && verifyName.id !== data.id) throw new ApiError('Já existe um serviço cadastrado com esse nome', 400, 'service')

    await this.ServiceRepository.update({ userId, ...service });

    return service
  }
}
