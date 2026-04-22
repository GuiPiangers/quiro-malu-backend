import { IPatientRepository } from "../patient/IPatientRepository";

export const createMockPatientRepository =
  (): jest.Mocked<IPatientRepository> => ({
    getById: jest.fn(),
    countAll: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getByCpf: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    getByHash: jest.fn(),
    saveMany: jest.fn(),
    getByBirthMonthAndDay: jest.fn(),
    getMostRecent: jest.fn(),
    getMostFrequent: jest.fn(),
    countPatientsOwnedByUser: jest.fn(),
  });
