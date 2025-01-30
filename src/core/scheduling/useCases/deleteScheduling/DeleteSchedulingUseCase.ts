import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class DeleteSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    await this.SchedulingRepository.delete({ id, userId });
  }
}
