import { Service, ServiceDTO } from "../../models/Service";
import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreateServiceUseCase {
  constructor(private ServiceRepository: IServiceRepository) {}

  async execute({ clinicId, ...data }: ServiceDTO & { clinicId: string }) {
    const service = new Service(data).getDTO();

    const [verifyName] = await this.ServiceRepository.getByName({
      name: service.name,
      clinicId,
    });
    if (verifyName)
      throw new ApiError(
        "Já existe um serviço cadastrado com esse nome",
        400,
        "service",
      );

    await this.ServiceRepository.save({ clinicId, ...service });

    return service;
  }
}
