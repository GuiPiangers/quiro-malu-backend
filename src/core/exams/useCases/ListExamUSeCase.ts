import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";

export class ListExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute({ patientId, userId }: { userId: string; patientId: string }) {
    const exams = await this.examRepository.list({
      patientId,
      userId,
    });

    return exams;
  }
}
