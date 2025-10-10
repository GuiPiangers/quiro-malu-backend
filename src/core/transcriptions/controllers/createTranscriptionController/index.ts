import { AzureSpeechTranscriptionAdapter } from "../../../../services/transcription/adapters/AzureSpeechTranscriptionAdapter";
import { CreateTranscriptionUseCase } from "../../useCases/CreateTranscriptionUseCase";
import { CreateTranscriptionController } from "./createTranscriptionController";

const transcriptionService = new AzureSpeechTranscriptionAdapter();
const createTranscriptionUseCase = new CreateTranscriptionUseCase(
  transcriptionService,
);
const createTranscriptionController = new CreateTranscriptionController(
  createTranscriptionUseCase,
);

export { createTranscriptionController };
