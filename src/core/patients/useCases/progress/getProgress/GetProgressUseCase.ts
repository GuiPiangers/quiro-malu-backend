import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { Progress } from "../../../models/Progress";

export class GetProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}

  async execute({
    id,
    patientId,
    clinicId,
  }: {
    id: string;
    patientId: string;
    clinicId: string;
  }) {
    const [progressData] = await this.ProgressRepository.get({
      id,
      patientId,
      clinicId,
    });

    if (!progressData) {
      throw new ApiError("Evolução não encontrada", 404);
    }

    const progress = new Progress(progressData);
    return progress.getDTO();
  }
}
