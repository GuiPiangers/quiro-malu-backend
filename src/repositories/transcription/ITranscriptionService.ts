import { EventEmitter } from "stream";

export interface ITranscriptionService extends EventEmitter {
  transcribe(filePath: Buffer): Promise<void>;
}
