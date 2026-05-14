import { Progress, ProgressDTO } from "../../../models/Progress";
import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class SetProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}
  async execute({ clinicId, ...data }: ProgressDTO & { clinicId: string }) {
    const progress = new Progress(data);
    const progressDTO = progress.getDTO();

    const [progressAlreadyExist] = await this.ProgressRepository.get({
      id: progressDTO.id,
      patientId: progressDTO.patientId,
      clinicId,
    });

    if (progressAlreadyExist) {
      await this.ProgressRepository.update({ ...progressDTO, clinicId });
    } else {
      await this.ProgressRepository.save({ ...progressDTO, clinicId });
    }

    return progressDTO;
  }
}
