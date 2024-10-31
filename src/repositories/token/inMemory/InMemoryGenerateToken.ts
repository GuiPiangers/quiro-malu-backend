import { IGenerateTokenProvider } from "../IGenerateTokenProvider";

export class InMemoryGenerateToken implements IGenerateTokenProvider {
  async execute(userId: string): Promise<string> {
    return (await "token") + userId;
  }
}
