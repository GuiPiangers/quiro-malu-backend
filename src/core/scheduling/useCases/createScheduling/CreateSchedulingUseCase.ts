import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import DatabaseStatusStrategy from "../../models/status/DatabaseStatusStrategy";
import { appEventListener } from "../../../shared/observers/EventListener";

export class CreateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    userId,
    ...data
  }: SchedulingDTO & { userId: string; date: string }) {
    const dataBaseStatusStrategy = new DatabaseStatusStrategy();
    const scheduling = new Scheduling(data, dataBaseStatusStrategy);

    const schedulingDTO = scheduling.getDTO();
    const schedules = await this.SchedulingRepository.list({
      userId,
      date: new DateTime(data.date).date,
    });

    if (scheduling.notAvailableDate(schedules))
      throw new ApiError("Horário indisponível", 400, "date");

    await this.SchedulingRepository.save({ ...schedulingDTO, userId });

    appEventListener.emit("createSchedule", {
      ...schedulingDTO,
      userId,
      scheduleId: schedulingDTO.id,
    });

    return schedulingDTO;
  }
}
