import { Progress, ProgressDTO } from "../../models/Progress";
import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";
import { ApiError } from "../../../../utils/ApiError";

export class SetProgressUseCase {
    constructor(private ProgressRepository: IProgressRepository) { }
    async execute(data: ProgressDTO, userId: string) {
        const progress = new Progress(data)
        const progressDTO = progress.getDTO()
        const [progressAlreadyExist] = await this.ProgressRepository.get(progressDTO.id!, progressDTO.patientId, userId)

        if (!data.patientId) throw new ApiError('Deve ser informado o patientId')

        if (progressAlreadyExist) {
            await this.ProgressRepository.update(progressDTO, userId);
        }
        else {
            await this.ProgressRepository.save(progressDTO, userId);
        }
        return progressDTO
    }
}
