import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";

export class GetProgressUseCase {
    constructor(
        private ProgressRepository: IProgressRepository
    ) { }

    async execute(id: string, patientId: string, userId: string) {
        const [progressData] = await this.ProgressRepository.get(id, patientId, userId)

        return progressData
    }
}