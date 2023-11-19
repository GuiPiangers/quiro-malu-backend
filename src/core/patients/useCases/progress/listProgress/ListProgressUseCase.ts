import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class ListProgressUseCase {
    constructor(
        private ProgressRepository: IProgressRepository
    ) { }

    async execute({ patientId, userId }: { patientId: string, userId: string }) {
        const progressData = await this.ProgressRepository.list({ patientId, userId })

        return progressData
    }
}