export interface ITranscriptionService {
  transcribe(filePath: Buffer): Promise<{ text: string }>;
}
