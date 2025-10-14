export class WhisperTranscriptionAdapter {
  async transcribe(file: Buffer) {
    const path = "https://api.openai.com/v1/audio/transcriptions";

    // Cria um arquivo Blob (ou File) a partir do Buffer
    const audioFile = new File([file], "audio.wav", { type: "audio/wav" });

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    const response = await fetch(path, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
    return { text: data.text };
  }
}
