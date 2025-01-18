import { IExamsFileStorageRepository } from "../../../repositories/examsFileStorage/IExamsFileStorageRepository";

export class DeleteExamUseCase {
  constructor(private examFileStorage: IExamsFileStorageRepository) {}

  async execute({
    id,
    patientId,
    userId,
  }: {
    id: string;
    userId: string;
    patientId: string;
  }) {
    await this.examFileStorage.delete({
      id,
      patientId,
      userId,
    });
  }
}
