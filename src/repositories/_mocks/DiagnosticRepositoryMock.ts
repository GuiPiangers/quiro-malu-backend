import { IDiagnosticRepository } from "../diagnostic/IDiagnosticRepository";
import type { Mocked } from "vitest";

export const createMockDiagnosticRepository= (): Mocked<IDiagnosticRepository>  => ( {
  get: vi.fn(),
  save: vi.fn(),
  saveMany: vi.fn(),
  update: vi.fn(),
});
