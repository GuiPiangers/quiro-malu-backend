import { IServiceRepository } from "../../../../repositories/service/IServiceRepository";

export class DeleteServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    await this.serviceRepository.delete({ id, userId });
  }
}
