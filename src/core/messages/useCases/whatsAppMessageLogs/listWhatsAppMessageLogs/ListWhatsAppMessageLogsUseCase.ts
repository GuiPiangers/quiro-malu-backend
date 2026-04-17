import {
  IWhatsAppMessageLogRepository,
  ListWhatsAppMessageLogsResult,
  ScheduleMessageType,
  WhatsAppMessageLogStatus,
} from "../../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import { ApiError } from "../../../../../utils/ApiError";

const STATUSES: WhatsAppMessageLogStatus[] = [
  "PENDING",
  "SENT",
  "DELIVERED",
  "READ",
  "FAILED",
];

const SCHEDULE_MESSAGE_TYPES: ScheduleMessageType[] = [
  "beforeSchedule",
  "afterSchedule",
];

export type ListWhatsAppMessageLogsInput = {
  userId: string;
  page?: number;
  limit?: number;
  patientId?: string;
  scheduleMessageType?: string;
  scheduleMessageConfigId?: string;
  status?: string;
};

export type ListWhatsAppMessageLogsOutput = ListWhatsAppMessageLogsResult & {
  page: number;
  limit: number;
};

export class ListWhatsAppMessageLogsUseCase {
  constructor(
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
  ) {}

  async execute(
    input: ListWhatsAppMessageLogsInput,
  ): Promise<ListWhatsAppMessageLogsOutput> {
    const page = Math.max(1, Number(input.page) || 1);
    const rawLimit = Number(input.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const offset = (page - 1) * limit;

    let status: WhatsAppMessageLogStatus | undefined;
    if (input.status != null && `${input.status}`.trim() !== "") {
      const s = `${input.status}`.toUpperCase() as WhatsAppMessageLogStatus;
      if (!STATUSES.includes(s)) {
        throw new ApiError("Status de log inválido", 400);
      }
      status = s;
    }

    let scheduleMessageType: ScheduleMessageType | undefined;
    if (input.scheduleMessageType != null && `${input.scheduleMessageType}`.trim() !== "") {
      const raw = `${input.scheduleMessageType}`.trim() as ScheduleMessageType;
      if (!SCHEDULE_MESSAGE_TYPES.includes(raw)) {
        throw new ApiError("Tipo de mensagem inválido", 400);
      }
      scheduleMessageType = raw;
    }

    const scheduleMessageConfigId =
      typeof input.scheduleMessageConfigId === "string" &&
      input.scheduleMessageConfigId.trim()
        ? input.scheduleMessageConfigId
        : undefined;

    const result = await this.whatsAppMessageLogRepository.listByUserId({
      userId: input.userId,
      patientId: input.patientId,
      scheduleMessageType,
      scheduleMessageConfigId,
      status,
      limit,
      offset,
    });

    return { ...result, page, limit };
  }
}
