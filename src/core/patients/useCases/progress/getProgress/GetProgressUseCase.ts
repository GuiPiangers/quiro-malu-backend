import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { Progress } from "../../../models/Progress";

export class GetProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}

  async execute({
    id,
    patientId,
    userId,
  }: {
    id: string;
    patientId: string;
    userId: string;
  }) {
    const [progressData] = await this.ProgressRepository.get({
      id,
      patientId,
      userId,
    });

    if (!progressData) {
      throw new ApiError("Evolução não encontrada", 404);
    }

    const progress = new Progress(progressData);
    return progress.getDTO();
  }
}
