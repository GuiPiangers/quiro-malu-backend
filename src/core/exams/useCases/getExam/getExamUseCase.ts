import { IExamsRepository } from "../../../../repositories/examsRepository/IExamsRepository";

export class GetExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute({
    patientId,
    userId,
    id,
  }: {
    userId: string;
    patientId: string;
    id: string;
  }) {
    const exam = await this.examRepository.get({
      patientId,
      userId,
      id,
    });

    return exam;
  }
}
