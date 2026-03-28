export interface SendMessageParams {
  to: string; // internacional sem "+": "5551999999999"
  body: string; // mensagem final renderizada
  instanceName: string; // instância da Evolution API
}

export interface SendMessageResult {
  success: boolean;
  providerMessageId?: string;
  errorMessage?: string;
}

export interface IWhatsAppProvider {
  sendMessage(params: SendMessageParams): Promise<SendMessageResult>;
  createInstance(instanceName: string): Promise<void>;
  getQrCode(instanceName: string): Promise<string | null>;
  getConnectionState(
    instanceName: string,
  ): Promise<"open" | "close" | "connecting">;
  deleteInstance(instanceName: string): Promise<void>;
}
