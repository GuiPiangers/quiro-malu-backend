export type saveExamProps = {
  userId: string;
  file: Express.Multer.File;
  fileName: string;
};
export type getExamProps = {
  userId: string;
};

export type deleteExamProps = {
  userId: string;
};

export interface IExamsFileStorageRepository {
  save(data: saveExamProps): Promise<void>;
  get(data: getExamProps): Promise<Buffer>;
  delete(data: deleteExamProps): Promise<void>;
}
