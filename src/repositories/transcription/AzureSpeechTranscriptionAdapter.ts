import { ITranscriptionService } from "./ITranscriptionService";

export class AzureSpeechTranscriptionAdapter implements ITranscriptionService {
  async transcribe(file: Buffer): Promise<{ text: string }> {
    const path = `https://${process.env.AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-11-15`;

    // Cria um arquivo Blob (ou File) a partir do Buffer
    const audioFile = new File(
      [file as ArrayBufferView<ArrayBuffer>],
      "audio.wav",
      { type: "audio/wav" },
    );

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("definition", '{"locales":["pt-BR"]}');

    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": `${process.env.AZURE_SPEECH_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `Error transcribing audio: ${response.status} - ${errText}`,
      );
    }

    const data = await response.json();
    const text = data.combinedPhrases
      .map((phrase: any) => phrase.text)
      .join(" ");

    return { text };
  }
}
