import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { DateTime } from "../../../shared/Date";
import { Scheduling } from "../../models/Scheduling";
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
    console.log("renderizou");
    const clientStatusStrategy = new ClientStatusStrategy();
    const date = schedulingDate || new DateTime(new Date().toString()).value;

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
        const result = new Scheduling(
          scheduling,
          clientStatusStrategy,
        ).getDTO();
        return {
          ...result,
          patient: scheduling.patient,
          phone: scheduling.phone,
        };
      }),
      total: total[0].total,
      limit,
    };
  }
}
