import { IExamsFileStorageRepository } from "../../../repositories/examsFileStorage/IExamsFileStorageRepository";
import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";

export class ListExamUseCase {
  constructor(
    private examRepository: IExamsRepository,
    private examFileStorage: IExamsFileStorageRepository,
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

    const examsDataQuery = this.examRepository.list({
      patientId,
      userId,
      config: {
        limit,
        offset,
      },
    });

    const totalQuery = this.examRepository.count({
      patientId,
      userId,
    });

    const [examsData, total] = await Promise.all([examsDataQuery, totalQuery]);

    const examsQuery = examsData.map(async (exam) => {
      const examFileUrl = await this.getFileUrl({
        patientId,
        userId,
        id: exam.id!,
        originalName: exam.fileName,
      });
      return { ...exam, url: examFileUrl };
    });

    const exams = await Promise.all(examsQuery);

    return { ...total, exams };
  }

  private async getFileUrl({
    id,
    patientId,
    userId,
    originalName,
  }: {
    id: string;
    userId: string;
    patientId: string;
    originalName: string;
  }) {
    const url = await this.examFileStorage.get({
      id,
      patientId,
      userId,
      originalName,
    });

    return url;
  }
}
