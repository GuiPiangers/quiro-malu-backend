import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class DeleteSchedulingUseCase {
    constructor(
        private SchedulingRepository: ISchedulingRepository,
    ) { }

    async execute({ id, patientId, userId }: { id: string, patientId: string, userId: string }) {
        await this.SchedulingRepository.delete({ id, patientId, userId })
    }
}