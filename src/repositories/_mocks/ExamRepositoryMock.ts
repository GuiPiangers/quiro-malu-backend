import { IExamsFileStorageRepository } from "../examsFileStorage/IExamsFileStorageRepository";
import { IExamsRepository } from "../examsRepository/IExamsRepository";

export const mockExamRepository: jest.Mocked<IExamsRepository> = {
  save: jest.fn(),
  update: jest.fn(),
  get: jest.fn(),
  list: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

export const mockExamFileStorageRepository: jest.Mocked<IExamsFileStorageRepository> =
  {
    save: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };
