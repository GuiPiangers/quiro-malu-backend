import { ILocationRepository } from "../location/ILocationRepository";

export const mockLocationRepository: jest.Mocked<ILocationRepository> = {
  getLocation: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  saveMany: jest.fn(),
};
