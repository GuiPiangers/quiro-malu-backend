import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";

export class DeleteProgressUseCase {
    constructor(
        private ProgressRepository: IProgressRepository,
    ) { }

    async execute(id: string, progressId: string, userId: string) {
        await this.ProgressRepository.delete(id, progressId, userId)
    }
}