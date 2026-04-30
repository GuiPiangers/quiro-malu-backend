import { IFinanceRepository } from "../finance/IFinanceRepository";
import type { Mocked } from "vitest";

export const createMockFinanceRepository= (): Mocked<IFinanceRepository>  => ( {
  create: vi.fn(),
  update: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
  getByScheduling: vi.fn(),
  delete: vi.fn(),
});
