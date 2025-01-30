import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { Progress } from "../../../models/Progress";

export class GetProgressBySchedulingUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}

  async execute({
    schedulingId,
    patientId,
    userId,
  }: {
    schedulingId: string;
    patientId: string;
    userId: string;
  }) {
    const [progressData] = await this.ProgressRepository.getByScheduling({
      schedulingId,
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
