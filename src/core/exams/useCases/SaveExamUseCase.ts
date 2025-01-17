import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";
import { Exam, ExamDTO } from "../models/Exam";

export class SaveExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute(data: ExamDTO & { userId: string }) {
    const { userId, ...examData } = data;
    const exam = new Exam(examData);
    const examDTO = exam.getDTO();

    await this.examRepository.save({ ...examDTO, userId });
  }
}
