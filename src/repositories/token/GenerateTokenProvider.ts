import type { GenerateTokenInput } from './IGenerateTokenProvider'
import { IGenerateTokenProvider } from './IGenerateTokenProvider'
import jwt from 'jsonwebtoken'
import { ApiError } from '../../utils/ApiError'
import * as dotenv from 'dotenv'
dotenv.config()

class GenerateTokenProvider implements IGenerateTokenProvider {
  async execute({ userId, clinicId, permissions }: GenerateTokenInput) {
    if (!process.env.JWT_SECRET) { throw new ApiError('Erro de configuração do servidor', 500) }
    const token = await jwt.sign(
      { id: userId, clinicId, permissions },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 6, // 6 hours
      },
    )
    return token
  }
}

const generateTokenProvider = new GenerateTokenProvider()

export { generateTokenProvider }
