import { ExamDTO } from "../../core/exams/models/Exam";

export type saveExamRepositoryRepositoryProps = {
  userId: string;
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
};
export type getExamRepositoryProps = {
  userId: string;
  patientId: string;
  id: string;
};

export type listExamRepositoryProps = {
  userId: string;
  patientId: string;
};

export type deleteExamRepositoryProps = {
  userId: string;
  patientId: string;
  id: string;
};

export interface IExamsRepository {
  save(data: saveExamRepositoryRepositoryProps): Promise<void>;
  get(data: getExamRepositoryProps): Promise<ExamDTO>;
  list(data: listExamRepositoryProps): Promise<ExamDTO[]>;
  delete(data: deleteExamRepositoryProps): Promise<void>;
}
