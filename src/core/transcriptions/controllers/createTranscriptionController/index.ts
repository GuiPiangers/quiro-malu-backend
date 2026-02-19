import { GroqTranscriptionAdapter } from "../../../../repositories/transcription/GroqTranscriptionAdapter";
import { CreateTranscriptionUseCase } from "../../useCases/CreateTranscriptionUseCase";
import { CreateTranscriptionController } from "./createTranscriptionController";

const transcriptionService = new GroqTranscriptionAdapter();
const createTranscriptionUseCase = new CreateTranscriptionUseCase(
  transcriptionService,
);
const createTranscriptionController = new CreateTranscriptionController(
  createTranscriptionUseCase,
);

export { createTranscriptionController };
