export interface IGenerateTokenProvider {
  execute(data: { userId: string; clinicId: string }): Promise<string>;
}
