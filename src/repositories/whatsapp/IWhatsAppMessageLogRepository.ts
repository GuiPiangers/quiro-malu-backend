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
  deliveredAt?: string | null;
  readAt?: string | null;
};

export type WhatsAppMessageLogDTO = {
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
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListWhatsAppMessageLogsFilter = {
  userId: string;
  patientId?: string;
  beforeScheduleMessageId?: string;
  status?: WhatsAppMessageLogStatus;
  limit: number;
  offset: number;
};

export type ListWhatsAppMessageLogsResult = {
  items: WhatsAppMessageLogDTO[];
  total: number;
};

export type WhatsAppMessageLogsSummaryDTO = {
  total: number;
  byStatus: Record<WhatsAppMessageLogStatus, number>;
  deliveryRate: number | null;
  readRate: number | null;
};

export interface IWhatsAppMessageLogRepository {
  save(data: SaveWhatsAppMessageLogProps): Promise<void>;
  updateByProviderMessageId(
    data: UpdateWhatsAppMessageLogByProviderIdProps,
  ): Promise<void>;
  listByUserId(
    filter: ListWhatsAppMessageLogsFilter,
  ): Promise<ListWhatsAppMessageLogsResult>;
  summaryByUserId(
    userId: string,
    filter?: { patientId?: string; beforeScheduleMessageId?: string },
  ): Promise<WhatsAppMessageLogsSummaryDTO>;
}
