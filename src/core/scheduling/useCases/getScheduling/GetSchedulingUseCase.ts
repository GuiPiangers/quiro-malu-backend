import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class GetSchedulingUseCase {
    constructor(
        private SchedulingRepository: ISchedulingRepository
    ) { }

    async execute({ id, patientId, userId }: { id: string, patientId: string, userId: string }) {
        const [schedulingData] = await this.SchedulingRepository.get({ id, patientId, userId })
        return schedulingData
    }
}