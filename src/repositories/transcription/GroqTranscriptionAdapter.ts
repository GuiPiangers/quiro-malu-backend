import { ITranscriptionService } from "./ITranscriptionService";
import Groq from "groq-sdk";

const groq = new Groq();

export class GroqTranscriptionAdapter implements ITranscriptionService {
  async transcribe(file: Buffer) {

    const audioFile = new File(
      [file as ArrayBufferView<ArrayBuffer>],
      "audio.wav",
      { type: "audio/wav" },
    );

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      prompt: "Evolução clínica de paciente em clínica de quiropraxia. Termos comuns: subluxação, ajuste, manipulação vertebral, coluna cervical, torácica, lombar, sacro, pelve, nervo ciático, hérnia de disco, escoliose, cifose, lordose, tensão muscular, amplitude de movimento",
      response_format: "text",
      language: "pt",
      temperature: 0.0,
    });

    return {
      text: transcription as unknown as string,
    }
  }
}
