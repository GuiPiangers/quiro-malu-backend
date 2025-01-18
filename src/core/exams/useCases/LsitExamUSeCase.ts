import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";

export class ListExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute({
    id,
    patientId,
    userId,
  }: {
    id: string;
    userId: string;
    patientId: string;
  }) {
    const exams = await this.examRepository.list({
      patientId,
      userId,
    });

    return exams;
  }
}
