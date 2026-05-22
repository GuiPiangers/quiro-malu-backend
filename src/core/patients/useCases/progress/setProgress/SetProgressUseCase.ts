import { Progress, ProgressDTO } from "../../../models/Progress";
import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class SetProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}
  async execute({ clinicId, ...data }: ProgressDTO & { clinicId: string }) {
    const [existing] = await this.ProgressRepository.get({
      id: data.id ?? "",
      patientId: data.patientId,
      clinicId,
    });

    const payload: ProgressDTO = existing ? { ...existing, ...data } : data;

    const progress = new Progress(payload);
    const progressDTO = progress.getDTO();

    if (existing) {
      await this.ProgressRepository.update({ ...progressDTO, clinicId });
    } else {
      await this.ProgressRepository.save({ ...progressDTO, clinicId });
    }

    return progressDTO;
  }
}
