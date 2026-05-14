import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class GetQtdSchedulesByDay {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    month,
    year,
    clinicId,
  }: {
    month: number;
    year: number;
    clinicId: string;
  }) {
    const qtdByDates = await this.SchedulingRepository.qdtSchedulesByDay({
      month,
      year,
      clinicId,
    });
    return qtdByDates.map((data) => ({
      date: data.formattedDate,
      qtd: data.qtd,
    }));
  }
}
