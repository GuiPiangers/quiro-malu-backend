import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class ListProgressUseCase {
    constructor(
        private ProgressRepository: IProgressRepository
    ) { }

    async execute({ patientId, userId, page }: { patientId: string, userId: string, page?: number }) {
        const limit = 10
        const offSet = page ? limit * (page - 1) : 0


        const progressData = this.ProgressRepository.list({ patientId, userId, config: { limit, offSet } })
        const totalProgress = this.ProgressRepository.count({ patientId, userId })

        const [progress, total] = await Promise.all([progressData, totalProgress])
        return { progress, total: total[0]['total'], limit }
    }
}