import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import DatabaseStatusStrategy from "../../models/status/DatabaseStatusStrategy";
import { appEventListener } from "../../../shared/observers/EventListener";
import { getValidObjectValues } from "../../../../utils/getValidObjectValues";

export class UpdateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

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

    await this.validateDate({ scheduling, userId });

    await this.SchedulingRepository.update({
      userId,
      id: data.id,
      ...schedulingDTO,
    });

    appEventListener.emit("updateSchedule", {
      ...schedulingDTO,
      userId,
      scheduleId: data.id,
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
