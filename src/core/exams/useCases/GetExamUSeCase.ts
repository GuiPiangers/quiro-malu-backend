import { IExamsFileStorageRepository } from "../../../repositories/examsFileStorage/IExamsFileStorageRepository";

export class GetExamUseCase {
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
    const url = await this.examFileStorage.get({
      id,
      patientId,
      userId,
    });

    return url;
  }
}
