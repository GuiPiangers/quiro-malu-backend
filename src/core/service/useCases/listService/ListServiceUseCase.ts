import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";

export class ListServiceUseCase {
  constructor(private ServiceRepository: IServiceRepository) {}

  async execute({ userId, page }: { userId: string; page?: number }) {
    const limit = 20;
    const offSet = page ? limit * (page - 1) : 0;

    const serviceData = this.ServiceRepository.list({
      userId,
      config: page === undefined ? {} : { limit, offSet },
    });
    const totalService = this.ServiceRepository.count({ userId });

    const [services, total] = await Promise.all([serviceData, totalService]);
    return { services, total: total[0].total, limit };
  }
}
