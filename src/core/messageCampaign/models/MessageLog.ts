export type MessageOrigin = "BIRTHDAY" | "APPOINTMENT_REMINDER" | "CAMPAIGN";
export type MessageStatus = "SENT" | "FAILED";

export interface MessageLogDTO {
  _id?: string;
  patientId: string;
  patientPhone: string;
  campaignId: string;
  origin: MessageOrigin;
  schedulingId?: string;
  renderedBody: string;
  status: MessageStatus;
  providerMessageId?: string;
  errorMessage?: string;
  sentAt?: Date;
  createdAt?: Date;
}
