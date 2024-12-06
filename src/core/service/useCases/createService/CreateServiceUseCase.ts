import { Service, ServiceDTO } from "../../models/Service";
import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreateServiceUseCase {
  constructor(private ServiceRepository: IServiceRepository) {}

  async execute({ userId, ...data }: ServiceDTO & { userId: string }) {
    const service = new Service(data).getDTO();

    const [verifyName] = await this.ServiceRepository.getByName({
      name: service.name,
      userId,
    });
    if (verifyName)
      throw new ApiError(
        "Já existe um serviço cadastrado com esse nome",
        400,
        "service",
      );

    await this.ServiceRepository.save({ userId, ...service });

    return service;
  }
}
