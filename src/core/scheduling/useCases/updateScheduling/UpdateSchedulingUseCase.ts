import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import DatabaseStatusStrategy from "../../models/status/DatabaseStatusStrategy";

export class UpdateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({ userId, ...data }: SchedulingDTO & { userId: string }) {
    const dataBaseStatusStrategy = new DatabaseStatusStrategy();
    const scheduling = new Scheduling(data, dataBaseStatusStrategy);

    const { id: _, ...schedulingDTO } = scheduling.getDTO();
    if (!data.id)
      throw new ApiError("O id deve ser informado", 400, "Scheduling");

    await this.validateDate({ scheduling, userId });

    await this.SchedulingRepository.update({
      userId,
      id: data.id,
      ...schedulingDTO,
    });

    return schedulingDTO;
  }

  private async validateDate({
    scheduling,
    userId,
  }: {
    scheduling: Scheduling;
    userId: string;
  }) {
    if (!scheduling.date?.dateTime) return;

    const schedules = await this.SchedulingRepository.list({
      userId,
      date: new DateTime(scheduling.date.dateTime).date,
    });

    if (scheduling.notAvailableDate(schedules))
      throw new ApiError("Horário indisponível", 400, "date");
  }
}
