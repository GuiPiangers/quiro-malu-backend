import { IDiagnosticRepository } from "../diagnostic/IDiagnosticRepository";

export const createMockDiagnosticRepository= (): jest.Mocked<IDiagnosticRepository>  => ( {
  get: jest.fn(),
  save: jest.fn(),
  saveMany: jest.fn(),
  update: jest.fn(),
});
