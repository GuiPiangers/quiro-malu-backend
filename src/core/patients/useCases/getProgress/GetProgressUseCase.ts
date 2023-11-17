import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";
import { Progress } from "../../models/Progress";

export class GetProgressUseCase {
    constructor(
        private ProgressRepository: IProgressRepository
    ) { }

    async execute(id: string, patientId: string, userId: string) {
        const [progressData] = await this.ProgressRepository.get(id, patientId, userId)
        const progress = new Progress(progressData)
        return progress.getDTO()
    }
}