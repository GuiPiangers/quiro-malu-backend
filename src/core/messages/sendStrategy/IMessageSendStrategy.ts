export type SendStrategyContext = {
  userId: string;
  clinicId: string;
  patientId: string;
  /** Id da campanha (config de mensagem), alinhado a `scheduleMessageConfigId` nos logs. */
  campaignId?: string;
}

export interface IMessageSendStrategy {
  readonly kind: string;
  allowsSend(ctx: SendStrategyContext): Promise<boolean>;
}
