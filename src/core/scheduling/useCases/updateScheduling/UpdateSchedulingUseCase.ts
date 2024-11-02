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

    const schedules = await this.SchedulingRepository.list({
      userId,
      date: new DateTime(data.date).date,
    });

    const updateScheduling = schedules.find(
      (schedulingValue) => schedulingValue.id === data.id,
    )?.date;
    const updateSchedulingDate =
      updateScheduling && new DateTime(updateScheduling).value;

    if (
      updateSchedulingDate !== data.date &&
      scheduling.isAvailableDate(schedules)
    )
      throw new ApiError("Horário indisponível", 400, "date");

    await this.SchedulingRepository.update({
      userId,
      id: data.id,
      ...schedulingDTO,
    });

    return schedulingDTO;
  }
}
