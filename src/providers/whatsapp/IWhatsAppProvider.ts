export interface SendMessageParams {
  to: string; // internacional sem "+": "5551999999999"
  body: string; // mensagem final renderizada
}

export interface SendMessageResult {
  success: boolean;
  providerMessageId?: string;
  errorMessage?: string;
}

export interface IWhatsAppProvider {
  sendMessage(params: SendMessageParams): Promise<SendMessageResult>;
}
