import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";

export class GetServiceUseCase {
    constructor(
        private ServiceRepository: IServiceRepository
    ) { }

    async execute({ id, clinicId }: { id: string; clinicId: string }) {
        const [serviceData] = await this.ServiceRepository.get({ id, clinicId })
        return serviceData
    }
}