import { IExamsRepository } from "../../../../repositories/examsRepository/IExamsRepository";
import { DateTime } from "../../../shared/Date";
import { appEventListener } from "../../../shared/observers/EventListener";

export class DeleteExamUseCase {
  constructor(private examRepository: IExamsRepository) {}

  async execute({
    id,
    patientId,
    userId,
    clinicId,
  }: {
    id: string;
    userId: string;
    clinicId: string;
    patientId: string;
  }) {
    await this.examRepository.update({
      id,
      patientId,
      userId,
      deleted: true,
      deletedDate: DateTime.now().date,
    });

    appEventListener.emit("deleteExam", {
      patientId,
      userId,
      clinicId,
      examId: id,
    });
  }
}
