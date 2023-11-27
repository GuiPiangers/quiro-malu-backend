import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class GetQtdSchedulesByDay {
    constructor(
        private SchedulingRepository: ISchedulingRepository
    ) { }

    async execute({ month, year, userId }: { month: number, year: number, userId: string }) {
        const qtdByDates = await this.SchedulingRepository.qdtSchedulesByDay({ month, year, userId })
        return qtdByDates.map(data => ({ date: data.formattedDate, qtd: data.qtd }))
    }
}