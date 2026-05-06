import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { IBlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { getValidObjectValues } from "../../../../utils/getValidObjectValues";
import { DateTime } from "../../../shared/Date";
import DatabaseStatusStrategy from "../../models/status/DatabaseStatusStrategy";
import {
  appEventListener,
  IAppEventListener,
} from "../../../shared/observers/EventListener";

export class UpdateSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private BlockSchedulingRepository: IBlockScheduleRepository,
    private readonly events: IAppEventListener = appEventListener,
  ) {}

  async execute({ userId, ...data }: SchedulingDTO & { userId: string }) {
    if (!data.id)
      throw new ApiError("O id deve ser informado", 400, "Scheduling");

    const dataBaseStatusStrategy = new DatabaseStatusStrategy();
    const rows = await this.SchedulingRepository.get({ id: data.id, userId });
    const [repositorySchedule] = rows ?? [];

    if (!repositorySchedule) {
      throw new ApiError("Agendamento não encontrado", 404);
    }

    const scheduling = new Scheduling(
      { ...repositorySchedule, ...getValidObjectValues(data) },
      dataBaseStatusStrategy,
    );

    const { id: _, ...schedulingDTO } = scheduling.getDTO();

    await this.validateBlockSchedules({ scheduling, userId });
    await this.validateDate({ scheduling, userId });

    await this.SchedulingRepository.update({
      userId,
      id: data.id,
      ...schedulingDTO,
    });

    this.events.emit("updateSchedule", {
      ...schedulingDTO,
      userId,
      scheduleId: data.id,
    });

    return schedulingDTO;
  }

  private async validateBlockSchedules({
    scheduling,
    userId,
  }: {
    scheduling: Scheduling;
    userId: string;
  }) {
    const blockSchedules =
      scheduling.date && scheduling.endDate
        ? await this.BlockSchedulingRepository.listBetweenDates({
            userId,
            endDate: scheduling.date,
            startDate: scheduling.endDate,
          })
        : [];

    blockSchedules?.forEach((blockSchedule) => {
      const scheduleOverlaps = blockSchedule.overlapsWithSchedule(scheduling);

      if (scheduleOverlaps)
        throw new ApiError(
          `O horário informado está bloqueado por um evento ${
            blockSchedule.description ?? ""
          }`,
        );
    });
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
