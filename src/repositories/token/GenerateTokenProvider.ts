import { IGenerateTokenProvider } from '@quiromalu/core/src/repositories/token/IGenerateTokenProvider'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

class GenerateTokenProvider implements IGenerateTokenProvider {
    async execute(userId: string) {
        if (!process.env.JWT_SECRET) throw new Error("Erro de configuração do servidor")
        const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 600 })
        return token
    }
}

const generateTokenProvider = new GenerateTokenProvider()

export { generateTokenProvider }

