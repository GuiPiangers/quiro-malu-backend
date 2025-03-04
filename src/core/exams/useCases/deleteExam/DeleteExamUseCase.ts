import { IExamsRepository } from "../../../../repositories/examsRepository/IExamsRepository";
import { DateTime } from "../../../shared/Date";
import { examObserver } from "../../../shared/observers/ExamObserver/ExamObserver";

export class DeleteExamUseCase {
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
      deleted: true,
      deletedDate: DateTime.now().date,
    });

    examObserver.emit("delete", { patientId, userId, id, fileName: "" });
  }
}
