import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class ListSchedulingUseCase {
    constructor(
        private SchedulingRepository: ISchedulingRepository
    ) { }

    async execute({ userId, patientId, page }: { userId: string, patientId: string, page?: number }) {
        const limit = 20
        const offSet = page ? limit * (page - 1) : 0

        const schedulingData = this.SchedulingRepository.list({ userId, patientId, config: { limit, offSet } })
        const totalScheduling = this.SchedulingRepository.count({ patientId, userId })

        const [schedules, total] = await Promise.all([schedulingData, totalScheduling])
        return { schedules: schedules, total: total[0]['total'], limit }
    }
}