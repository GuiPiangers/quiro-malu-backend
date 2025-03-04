import { IExamsRepository } from "../../../../repositories/examsRepository/IExamsRepository";
import { NotificationUndoExam } from "../../../notification/models/NotificationUndoExam";

export class RestoreExamUseCase {
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
    await this.examRepository.update({
      id,
      patientId,
      userId,
      deleted: false,
      deletedDate: null,
    });
  }
}
