export type WhatsAppMessageLogStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED";

export type SaveWhatsAppMessageLogProps = {
  id: string;
  userId: string;
  patientId: string;
  schedulingId: string;
  beforeScheduleMessageId: string;
  message: string;
  toPhone: string;
  instanceName: string;
  status: WhatsAppMessageLogStatus;
  providerMessageId: string | null;
  errorMessage?: string | null;
};

export type UpdateWhatsAppMessageLogByProviderIdProps = {
  providerMessageId: string;
  status: WhatsAppMessageLogStatus;
  errorMessage?: string | null;
};

export interface IWhatsAppMessageLogRepository {
  save(data: SaveWhatsAppMessageLogProps): Promise<void>;
  updateByProviderMessageId(
    data: UpdateWhatsAppMessageLogByProviderIdProps,
  ): Promise<void>;
}
