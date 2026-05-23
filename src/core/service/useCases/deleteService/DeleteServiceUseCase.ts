import { IServiceRepository } from '../../../../repositories/service/IServiceRepository'

export class DeleteServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  async execute({ id, clinicId }: { id: string; clinicId: string }) {
    await this.serviceRepository.delete({ id, clinicId })
  }
}
