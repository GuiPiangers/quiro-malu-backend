import { Progress, ProgressDTO } from "../../../models/Progress";
import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class SetProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}
  async execute({ userId, ...data }: ProgressDTO & { userId: string }) {
    const progress = new Progress(data);
    const progressDTO = progress.getDTO();

    const [progressAlreadyExist] = await this.ProgressRepository.get({
      id: progressDTO.id,
      patientId: progressDTO.patientId,
      userId,
    });

    if (progressAlreadyExist) {
      await this.ProgressRepository.update({ ...progressDTO, userId });
    } else {
      await this.ProgressRepository.save({ ...progressDTO, userId });
    }

    return progressDTO;
  }
}
