import { EventEmitter } from "events";
import { speechConfig, sdk } from "../../../database/azure/speechClient";

export class AzureSpeechTranscriptionAdapter extends EventEmitter {
  private previousText: string = "";

  async transcribe(audioBuffer: Buffer) {
    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizing = (_, e) => {
      this.emit("data", {
        type: "partial",
        text: this.getNewTextSegment(e.result.text),
      });
      this.previousText += e.result.text;
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        this.emit("data", { type: "final", text: e.result.text });
      }
    };

    recognizer.canceled = (_, e) => {
      if (e.reason === sdk.CancellationReason.Error) {
        this.emit("data", { type: "error", error: e.errorDetails });
        recognizer.stopContinuousRecognitionAsync();
      }
    };

    recognizer.sessionStopped = () => {
      recognizer.stopContinuousRecognitionAsync();
      this.emit("end");
    };

    recognizer.startContinuousRecognitionAsync();
  }

  private getNewTextSegment(currentText: string): string {
    if (!this.previousText) return currentText;

    const prev = this.previousText.trim();
    const curr = currentText.trim();

    if (curr.startsWith(prev)) {
      return curr.slice(prev.length).trim();
    }

    for (let i = prev.length; i > 0; i--) {
      const suffix = prev.slice(-i);
      if (curr.startsWith(suffix)) {
        return curr.slice(i);
      }
    }

    return curr;
  }
}
