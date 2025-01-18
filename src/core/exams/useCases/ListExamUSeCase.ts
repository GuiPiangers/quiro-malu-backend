import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";

export class ListExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute({
    patientId,
    userId,
    page = 1,
  }: {
    userId: string;
    patientId: string;
    page?: number;
  }) {
    if (page < 1) page = 1;
    const limit = 5;
    const offset = page - 1;

    const exams = await this.examRepository.list({
      patientId,
      userId,
      config: {
        limit,
        offset,
      },
    });

    return exams;
  }
}
