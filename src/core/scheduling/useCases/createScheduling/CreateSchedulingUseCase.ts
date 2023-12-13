import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import { type } from "os";

export class CreateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) { }

  async execute({ userId, ...data }: SchedulingDTO & { userId: string }) {
    const scheduling = new Scheduling(data)
    const schedulingDTO = scheduling.getDTO()

    const schedules = await this.SchedulingRepository.list({ userId, date: new DateTime(data.date).date });

    if (scheduling.isAvailableDate(schedules)) throw new ApiError('Horário indisponível', 400, 'date')

    await this.SchedulingRepository.save({ userId, ...schedulingDTO });

    return schedulingDTO
  }
}
