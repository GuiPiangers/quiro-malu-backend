import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class GetSchedulingUseCase {
    constructor(
        private SchedulingRepository: ISchedulingRepository
    ) { }

    async execute({ id, userId }: { id: string, userId: string }) {
        const [schedulingData] = await this.SchedulingRepository.get({ id, userId })
        return schedulingData
    }
}