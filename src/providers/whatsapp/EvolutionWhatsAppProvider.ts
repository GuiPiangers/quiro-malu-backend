import axios from "axios";
import {
  IWhatsAppProvider,
  SendMessageParams,
  SendMessageResult,
} from "./IWhatsAppProvider";

export class EvolutionWhatsAppProvider implements IWhatsAppProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  private get url() {
    return this.baseUrl.replace(/\/$/, "");
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      apikey: this.apiKey,
    };
  }

  async sendMessage({
    to,
    body,
    instanceName,
  }: SendMessageParams): Promise<SendMessageResult> {
    try {
      const response = await axios.post(
        `${this.url}/message/sendText/${instanceName}`,
        { number: to, text: body },
        { headers: this.headers },
      );

      const providerMessageId = response.data?.key?.id;

      return {
        success: true,
        providerMessageId: providerMessageId
          ? String(providerMessageId)
          : undefined,
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

  async createInstance(instanceName: string): Promise<void> {
    await axios.post(
      `${this.url}/instance/create`,
      { instanceName, qrcode: true, integration: "WHATSAPP-BAILEYS" },
      { headers: this.headers },
    );
  }

  async getQrCode(instanceName: string): Promise<string | null> {
    const response = await axios.get(
      `${this.url}/instance/connect/${instanceName}`,
      { headers: this.headers },
    );
    return response.data?.base64 ?? null;
  }

  async getConnectionState(
    instanceName: string,
  ): Promise<"open" | "close" | "connecting"> {
    const response = await axios.get(
      `${this.url}/instance/connectionState/${instanceName}`,
      { headers: this.headers },
    );
    return response.data?.instance?.state ?? "close";
  }

  async deleteInstance(instanceName: string): Promise<void> {
    await axios.delete(`${this.url}/instance/delete/${instanceName}`, {
      headers: this.headers,
    });
  }
}
