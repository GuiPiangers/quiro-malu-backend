import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";

export class CreateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) { }

  async execute({ userId, ...data }: SchedulingDTO & { userId: string }) {
    const scheduling = new Scheduling(data).getDTO()

    const schedules = await this.SchedulingRepository.list({ userId, date: new DateTime(data.date).date });
    const isInRange = schedules.some(schedulingValue => {
      console.log(schedulingValue.date)

    })
    await this.SchedulingRepository.save({ userId, ...scheduling });

    return scheduling
  }
}
