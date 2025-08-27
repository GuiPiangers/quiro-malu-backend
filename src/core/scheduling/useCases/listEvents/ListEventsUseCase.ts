import { SchedulingDTO } from "../../models/Scheduling";
import { BlockSchedule } from "../../models/BlockSchedule";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { IBlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";
import { DateTime } from "../../../shared/Date";
import { BlockScheduleDto } from "../../models/dtos/BlockSchedule.dto";

interface IListEventsUseCaseRequest {
  date: string;
  userId: string;
}

interface IListEventsUseCaseResponse {
  data: (SchedulingDTO | BlockScheduleDto)[];
}

export class ListEventsUseCase {
  constructor(
    private scheduleRepository: ISchedulingRepository,
    private blockScheduleRepository: IBlockScheduleRepository,
  ) {}

  async execute({
    date,
    userId,
  }: IListEventsUseCaseRequest): Promise<IListEventsUseCaseResponse> {
    const onlyDate = date.substring(0, 10);
    const startDate = new DateTime(`${onlyDate}T00:00`);
    const endDate = new DateTime(`${onlyDate}T23:59`);

    const [schedules, blockedSchedules] = await Promise.all([
      this.scheduleRepository.list({
        date,
        userId,
      }),
      this.blockScheduleRepository.listBetweenDates({
        userId,
        startDate,
        endDate,
      }),
    ]);

    const combinedList = [...schedules, ...blockedSchedules].sort((a, b) => {
      const dateA = this.isBlockSchedule(a) ? a.startDate.dateTime : a.date;
      const dateB = this.isBlockSchedule(b) ? b.endDate.dateTime : b.date;
      return dateA?.localeCompare(dateB || "") ?? 0;
    });

    return {
      data: combinedList.map((event) =>
        this.isBlockSchedule(event) ? event.getDTO() : event,
      ),
    };
  }

  private isBlockSchedule(
    event: SchedulingDTO | BlockSchedule,
  ): event is BlockSchedule {
    return event instanceof BlockSchedule;
  }
}
