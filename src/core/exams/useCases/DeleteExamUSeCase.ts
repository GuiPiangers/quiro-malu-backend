import { IExamsFileStorageRepository } from "../../../repositories/examsFileStorage/IExamsFileStorageRepository";
import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";

export class DeleteExamUseCase {
  constructor(
    private examRepository: IExamsRepository,
    private examFileStorage: IExamsFileStorageRepository,
  ) {}

  async execute({
    id,
    patientId,
    userId,
  }: {
    id: string;
    userId: string;
    patientId: string;
  }) {
    const deleteExamStorageFile = this.examFileStorage.delete({
      id,
      patientId,
      userId,
    });
    const deleteExamOnRepository = this.examRepository.delete({
      id,
      patientId,
      userId,
    });

    await Promise.all([deleteExamStorageFile, deleteExamOnRepository]);
  }
}
