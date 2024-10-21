import { IGenerateTokenProvider } from "../../repositories/token/IGenerateTokenProvider";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError";
import * as dotenv from "dotenv";
dotenv.config();

class GenerateTokenProvider implements IGenerateTokenProvider {
  async execute(userId: string) {
    if (!process.env.JWT_SECRET)
      throw new ApiError("Erro de configuração do servidor", 500);
    const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: 60 * 10,
    });
    return token;
  }
}

const generateTokenProvider = new GenerateTokenProvider();

export { generateTokenProvider };
