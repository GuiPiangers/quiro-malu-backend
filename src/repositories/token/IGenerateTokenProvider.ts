export interface IGenerateTokenProvider {
  execute(userId: string): Promise<string>;
}
