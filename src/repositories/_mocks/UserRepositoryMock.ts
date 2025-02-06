import { IGenerateTokenProvider } from "../token/IGenerateTokenProvider";
import { IRefreshTokenProvider } from "../token/IRefreshTokenProvider";
import { IUserRepository } from "../user/IUserRepository";

export const createMockUserRepository = (): IUserRepository => ({
  getByEmail: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
});

export const createMockRefreshTokenProvider =
  (): jest.Mocked<IRefreshTokenProvider> => ({
    delete: jest.fn(),
    generate: jest.fn(),
    getRefreshToken: jest.fn(),
  });

export const createMockGenerateTokenProvider =
  (): jest.Mocked<IGenerateTokenProvider> => ({
    execute: jest.fn(),
  });
