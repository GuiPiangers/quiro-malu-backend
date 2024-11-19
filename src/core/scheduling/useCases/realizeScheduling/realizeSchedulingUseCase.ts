import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";

export class RealizeSchedulingUseCase {
  constructor(
    private schedulingRepository: ISchedulingRepository,
    private progressRepository: IProgressRepository,
  ) {}

  async execute({
    userId,
    patientId,
    progressId,
    schedulingId,
  }: {
    userId: string;
    patientId: string;
    schedulingId: string;
    progressId: string;
  }) {
    const [[progress], [scheduling]] = await Promise.all([
      this.progressRepository.get({
        id: progressId,
        userId,
        patientId,
      }),
      this.schedulingRepository.get({
        id: schedulingId,
        userId,
      }),
    ]);
  }
}
