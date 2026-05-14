import { IGenerateTokenProvider } from "../IGenerateTokenProvider";

export class InMemoryGenerateToken implements IGenerateTokenProvider {
  async execute({
    userId,
    clinicId,
  }: {
    userId: string;
    clinicId: string;
  }): Promise<string> {
    return (await "token") + userId + clinicId;
  }
}
