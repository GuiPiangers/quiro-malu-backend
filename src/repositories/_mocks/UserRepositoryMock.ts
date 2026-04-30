import { IGenerateTokenProvider } from "../token/IGenerateTokenProvider";
import { IRefreshTokenProvider } from "../token/IRefreshTokenProvider";
import { IUserRepository } from "../user/IUserRepository";
import type { Mocked } from "vitest";

export const createMockUserRepository = (): IUserRepository => ({
  getByEmail: vi.fn(),
  getById: vi.fn(),
  save: vi.fn(),
});

export const createMockRefreshTokenProvider =
  (): Mocked<IRefreshTokenProvider> => ({
    delete: vi.fn(),
    generate: vi.fn(),
    getRefreshToken: vi.fn(),
  });

export const createMockGenerateTokenProvider =
  (): Mocked<IGenerateTokenProvider> => ({
    execute: vi.fn(),
  });
