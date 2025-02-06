import { ILocationRepository } from "../location/ILocationRepository";

export const createMockLocationRepository= (): jest.Mocked<ILocationRepository>  => ( {
  getLocation: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  saveMany: jest.fn(),
});
