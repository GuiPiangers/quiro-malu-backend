import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY!,
  process.env.AZURE_SPEECH_REGION!,
);

speechConfig.speechRecognitionLanguage = "pt-BR";

export { sdk, speechConfig };
