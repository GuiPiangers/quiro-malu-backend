import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class DeleteProgressUseCase {
    constructor(
        private ProgressRepository: IProgressRepository,
    ) { }

    async execute({ id, patientId, userId }: { id: string, patientId: string, userId: string }) {
        await this.ProgressRepository.delete({ id, patientId, userId })
    }
}