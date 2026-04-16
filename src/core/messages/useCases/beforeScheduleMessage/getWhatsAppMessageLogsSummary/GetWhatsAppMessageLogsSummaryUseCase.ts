import { IWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";

export type GetWhatsAppMessageLogsSummaryInput = {
  userId: string;
  patientId?: string;
  beforeScheduleMessageId?: string;
};

export class GetWhatsAppMessageLogsSummaryUseCase {
  constructor(
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
  ) {}

  async execute(input: GetWhatsAppMessageLogsSummaryInput) {
    return this.whatsAppMessageLogRepository.summaryByUserId(input.userId, {
      patientId: input.patientId,
      beforeScheduleMessageId: input.beforeScheduleMessageId,
    });
  }
}
