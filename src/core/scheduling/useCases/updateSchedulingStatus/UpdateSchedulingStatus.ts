import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { SchedulingStatus } from "../../models/Scheduling";

export class UpdateSchedulingStatusUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    userId,
    id,
    status,
  }: {
    id: string;
    userId: string;
    status: SchedulingStatus;
  }) {
    await this.SchedulingRepository.update({
      userId,
      id,
      status,
    });

    return { userId, id, status };
  }
}
