import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import DatabaseStatusStrategy from "../../models/status/DatabaseStatusStrategy";
import { appEventListener } from "../../../shared/observers/EventListener";
import { IBlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";

export class CreateSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private BlockSchedulingRepository: IBlockScheduleRepository,
  ) {}

  async execute({
    userId,
    ...data
  }: SchedulingDTO & { userId: string; date: string }) {
    const dataBaseStatusStrategy = new DatabaseStatusStrategy();
    const scheduling = new Scheduling(data, dataBaseStatusStrategy);

    const blockSchedules =
      scheduling.date && scheduling.endDate
        ? await this.BlockSchedulingRepository.listBetweenDates({
            userId,
            endDate: scheduling.date,
            startDate: scheduling.endDate,
          })
        : [];

    blockSchedules?.forEach((blockSchedule) => {
      const scheduleOverlaps = blockSchedule.overlapsWith(scheduling);

      if (scheduleOverlaps)
        throw new ApiError(
          `O horário informado está bloqueado por um evento ${
            blockSchedule.description ?? ""
          }`,
        );
    });

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
