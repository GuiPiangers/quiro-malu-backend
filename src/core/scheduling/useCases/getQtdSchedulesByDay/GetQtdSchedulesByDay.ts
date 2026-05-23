import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'

export class GetQtdSchedulesByDay {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    month,
    year,
    clinicId,
    userId,
  }: {
    month: number
    year: number
    clinicId: string
    userId: string
  }) {
    const qtdByDates = await this.SchedulingRepository.qdtSchedulesByDay({
      month,
      year,
      clinicId,
      userId,
    })
    return qtdByDates.map((data) => ({
      date: data.formattedDate,
      qtd: data.qtd,
    }))
  }
}
