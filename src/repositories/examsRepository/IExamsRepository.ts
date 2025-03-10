import { ExamDTO } from "../../core/exams/models/Exam";

export type saveExamRepositoryRepositoryProps = {
  userId: string;
  id: string;
  patientId: string;
  fileName: string;
  fileSize?: number;
};
export type updateExamRepositoryRepositoryProps =
  Partial<saveExamRepositoryRepositoryProps> & {
    userId: string;
    patientId: string;
    id: string;
    deleted?: boolean;
    deletedDate?: string | null;
  };
export type getExamRepositoryProps = {
  userId: string;
  patientId: string;
  id: string;
};

export type listExamRepositoryProps = {
  userId: string;
  patientId: string;
  config: { limit: number; offset: number };
};

export type countExamRepositoryProps = {
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
  update(data: updateExamRepositoryRepositoryProps): Promise<void>;
  get(data: getExamRepositoryProps): Promise<ExamDTO>;
  list(data: listExamRepositoryProps): Promise<ExamDTO[]>;
  delete(data: deleteExamRepositoryProps): Promise<void>;
  count(data: countExamRepositoryProps): Promise<{ total: number }>;
}
