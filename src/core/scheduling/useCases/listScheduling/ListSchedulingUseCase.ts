import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { DateTime } from "../../../shared/Date";

export class ListSchedulingUseCase {
    constructor(
        private SchedulingRepository: ISchedulingRepository
    ) { }

    async execute({ userId, date: schedulingDate, page }: { userId: string, date: string, page?: number }) {
        const limit = 20
        const offSet = page ? limit * (page - 1) : 0
        const date = schedulingDate || new DateTime(new Date().toString()).value

        const schedulingData = this.SchedulingRepository.list({
            userId,
            date,
            config: { limit, offSet }
        })
        const totalScheduling = this.SchedulingRepository.count({
            userId,
            date
        })

        const [schedules, total] = await Promise.all([schedulingData, totalScheduling])
        return { schedules: schedules, total: total[0]['total'], limit }
    }
}