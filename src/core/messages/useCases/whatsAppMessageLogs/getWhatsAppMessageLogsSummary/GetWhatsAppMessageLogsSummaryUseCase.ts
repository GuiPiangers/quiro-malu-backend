import {
  IWhatsAppMessageLogRepository,
  ScheduleMessageType,
} from "../../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";

export type GetWhatsAppMessageLogsSummaryInput = {
  userId: string;
  patientId?: string;
  scheduleMessageType?: ScheduleMessageType;
  scheduleMessageConfigId?: string;
};

export class GetWhatsAppMessageLogsSummaryUseCase {
  constructor(
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
  ) {}

  async execute(input: GetWhatsAppMessageLogsSummaryInput) {
    const scheduleMessageConfigId =
      typeof input.scheduleMessageConfigId === "string" &&
      input.scheduleMessageConfigId.trim()
        ? input.scheduleMessageConfigId
        : undefined;

    return this.whatsAppMessageLogRepository.summaryByUserId(input.userId, {
      patientId: input.patientId,
      scheduleMessageType: input.scheduleMessageType,
      scheduleMessageConfigId,
    });
  }
}
