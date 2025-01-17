import { IExamsFileStorageRepository } from "../../../repositories/examsFileStorage/IExamsFileStorageRepository";
import { IExamsRepository } from "../../../repositories/examsRepository/IExamsRepository";
import { Exam, ExamDTO } from "../models/Exam";

export class SaveExamUseCase {
  constructor(
    private examRepository: IExamsRepository,
    private examFileStorage: IExamsFileStorageRepository,
  ) {}

  async execute({
    file,
    patientId,
    userId,
  }: {
    file: Express.Multer.File;
    patientId: string;
    userId: string;
  }) {
    const fileName = file.originalname;
    const fileSize = file.size;

    const exam = new Exam({ fileName, fileSize, patientId });
    const id = exam.id;

    await this.examRepository.save({
      fileName,
      fileSize,
      patientId,
      userId,
      id,
    });

    await this.examFileStorage.save({
      file,
      id,
      userId,
      patientId,
    });
  }
}
