import { IDiagnosticRepository } from "../diagnostic/IDiagnosticRepository";

export const mockDiagnosticRepository: jest.Mocked<IDiagnosticRepository> = {
  get: jest.fn(),
  save: jest.fn(),
  saveMany: jest.fn(),
  update: jest.fn(),
};
