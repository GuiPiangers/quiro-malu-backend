import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";

export class RealizeSchedulingUseCase {
  constructor(
    private schedulingRepository: ISchedulingRepository,
    private progressRepository: IProgressRepository,
  ) {}

  async execute({
    userId,
    patientId,
    schedulingId,
  }: {
    userId: string;
    patientId: string;
    schedulingId: string;
  }) {
    const [[progress]] = await Promise.all([
      this.progressRepository.getByScheduling({
        schedulingId,
        userId,
        patientId,
      }),
    ]);

    if (!progress?.schedulingId) {
      throw new ApiError(
        "A evolução deve ser salva para poder realizar a consulta",
        401,
      );
    }
    return await this.schedulingRepository.update({
      id: schedulingId,
      userId,
      status: "Atendido",
    });
  }
}
