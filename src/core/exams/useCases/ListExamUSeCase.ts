import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";
import { GetExamUseCase } from "./GetExamUSeCase";

export class ListExamUseCase {
  constructor(
    private examRepository: IExamsRepository,
    private getExamUseCase: GetExamUseCase,
  ) {}

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
    const offset = (page - 1) * limit;

    const examsData = await this.examRepository.list({
      patientId,
      userId,
      config: {
        limit,
        offset,
      },
    });

    const exams = examsData.map(async (exam) => {
      const examFileUrl = await this.getExamUseCase.execute({
        patientId,
        userId,
        id: exam.id!,
      });
      return { ...exam, url: examFileUrl };
    });

    const resolvedExams = await Promise.all(exams);

    return resolvedExams;
  }
}
