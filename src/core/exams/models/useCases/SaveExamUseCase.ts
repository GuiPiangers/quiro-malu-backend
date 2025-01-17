import { IExamsRepository } from "../../../../repositories/examsRepository/IExamsRepository";
import { Exam, ExamDTO } from "../Exam";

export class saveExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute(data: ExamDTO & { userId: string }) {
    const { userId, ...examData } = data;
    const exam = new Exam(examData);
    const examDTO = exam.getDTO();

    await this.examRepository.save({ ...examDTO, userId });
  }
}
