import axios from "axios";
import {
  IWhatsAppProvider,
  SendMessageParams,
  SendMessageResult,
} from "./IWhatsAppProvider";

export class EvolutionWhatsAppProvider implements IWhatsAppProvider {
  constructor(
    private readonly baseUrl: string, // ex: "http://localhost:8080"
    private readonly apiKey: string,
    private readonly instance: string,
  ) {}

  async sendMessage({ to, body }: SendMessageParams): Promise<SendMessageResult> {
    const urlBase = this.baseUrl.replace(/\/$/, "");

    try {
      const response = await axios.post(
        `${urlBase}/message/sendText/${this.instance}`,
        { number: to, text: body },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: this.apiKey,
          },
        },
      );

      const providerMessageId = response.data?.key?.id;

      return {
        success: true,
        providerMessageId: providerMessageId ? String(providerMessageId) : undefined,
      };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ?? err?.message ?? "Unknown error";

      return {
        success: false,
        errorMessage: String(errorMessage),
      };
    }
  }
}
