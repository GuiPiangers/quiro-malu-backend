import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";

export class GetServiceUseCase {
    constructor(
        private ServiceRepository: IServiceRepository
    ) { }

    async execute({ id, userId }: { id: string, userId: string }) {
        const [serviceData] = await this.ServiceRepository.get({ id, userId })
        return serviceData
    }
}