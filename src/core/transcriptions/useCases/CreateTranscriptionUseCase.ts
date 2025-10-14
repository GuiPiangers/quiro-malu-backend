import { ITranscriptionService } from "../../../repositories/transcription/ITranscriptionService";

export class CreateTranscriptionUseCase {
  constructor(private readonly transcriptionService: ITranscriptionService) {}

  async execute(audioBuffer: Buffer) {
    const result = await this.transcriptionService.transcribe(audioBuffer);
    return result;
  }
}
