import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { DateTime } from "../../../shared/Date";
import { SchedulingWithPatient } from "../../models/SchedulingWithPatient";
import ClientStatusStrategy from "../../models/status/ClientStatusStrategy";

export class ListSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    userId,
    date: schedulingDate,
  }: {
    userId: string;
    date: string;
    page?: number;
  }) {
    const limit = 20;
    const clientStatusStrategy = new ClientStatusStrategy();
    const date = schedulingDate || DateTime.now().dateTime;

    const schedulingData = this.SchedulingRepository.list({
      userId,
      date,
    });
    const totalScheduling = this.SchedulingRepository.count({
      userId,
      date,
    });

    const [schedules, total] = await Promise.all([
      schedulingData,
      totalScheduling,
    ]);

    return {
      schedules: schedules.map((scheduling) => {
        return new SchedulingWithPatient(
          scheduling,
          clientStatusStrategy,
        ).getDTO();
      }),
      total: total[0].total,
      limit,
    };
  }
}
