export type saveExamProps = {
  userId: string;
  file: Express.Multer.File;
  patientId: string;
  id: string;
};
export type getExamProps = {
  userId: string;
  patientId: string;
  id: string;
};

export type deleteExamProps = {
  userId: string;
};

export interface IExamsFileStorageRepository {
  save(data: saveExamProps): Promise<void>;
  get(data: getExamProps): Promise<string>;
  delete(data: deleteExamProps): Promise<void>;
}
