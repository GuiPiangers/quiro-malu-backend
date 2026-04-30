import { ILocationRepository } from "../location/ILocationRepository";
import type { Mocked } from "vitest";

export const createMockLocationRepository= (): Mocked<ILocationRepository>  => ( {
  getLocation: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  saveMany: vi.fn(),
});
