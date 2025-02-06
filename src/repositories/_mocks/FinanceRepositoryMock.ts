import { IFinanceRepository } from "../finance/IFinanceRepository";

export const createMockFinanceRepository= (): jest.Mocked<IFinanceRepository>  => ( {
  create: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  get: jest.fn(),
  getByScheduling: jest.fn(),
  delete: jest.fn(),
});
