import { IMessageLogRepository } from "../messaging/IMessageLogRepository";

export const createMockMessageLogRepository =
  (): jest.Mocked<IMessageLogRepository> => ({
    save: jest.fn(),
    saveMany: jest.fn(),
    getByPatient: jest.fn(),
    getByCampaign: jest.fn(),
    countByCampaign: jest.fn(),
    existsBySchedulingAndCampaign: jest.fn(),
  });
