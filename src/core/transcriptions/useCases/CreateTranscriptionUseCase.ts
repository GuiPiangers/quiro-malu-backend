import { ITranscriptionService } from "../../../repositories/transcription/ITranscriptionService";

export class CreateTranscriptionUseCase {
  constructor(private readonly transcriptionService: ITranscriptionService) {}

  execute(audioBuffer: Buffer) {
    this.transcriptionService.transcribe(audioBuffer);
    return this.transcriptionService;
  }
}
