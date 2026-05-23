import type { GenerateTokenInput } from '../IGenerateTokenProvider'
import { IGenerateTokenProvider } from '../IGenerateTokenProvider'

export class InMemoryGenerateToken implements IGenerateTokenProvider {
  async execute({
    userId,
    clinicId,
    permissions,
  }: GenerateTokenInput): Promise<string> {
    return `token-${userId}-${clinicId}-${permissions.length}`
  }
}
