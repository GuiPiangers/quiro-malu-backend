import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) { }

  async execute({ userId, ...data }: SchedulingDTO & { userId: string }) {
    const scheduling = new Scheduling(data).getDTO()

    await this.SchedulingRepository.save({ userId, ...scheduling });

    return scheduling
  }
}
