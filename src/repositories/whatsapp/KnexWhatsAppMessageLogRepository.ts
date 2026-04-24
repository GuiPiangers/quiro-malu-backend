import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  GetBySchedulingAndCampaignIdProps,
  IWhatsAppMessageLogRepository,
  ListWhatsAppMessageLogsFilter,
  ListWhatsAppMessageLogsResult,
  SaveWhatsAppMessageLogProps,
  ScheduleMessageType,
  UpdateWhatsAppMessageLogByProviderIdProps,
  WhatsAppMessageLogDTO,
  WhatsAppMessageLogStatus,
  WhatsAppMessageLogsSummaryDTO,
} from "./IWhatsAppMessageLogRepository";

type MessageLogRow = {
  id: string;
  userId: string;
  patientId: string;
  schedulingId: string;
  scheduleMessageType: ScheduleMessageType;
  scheduleMessageConfigId: string;
  message: string;
  toPhone: string;
  instanceName: string;
  status: WhatsAppMessageLogStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  sentAt: Date | string | null;
  deliveredAt: Date | string | null;
  readAt: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(d: Date | string | null | undefined): string | null {
  if (d == null) return null;
  const t = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(t.getTime())) return null;
  return t.toISOString();
}

function countTotal(result: unknown): number {
  const rows = Array.isArray(result) ? result : [result];
  const r = rows[0] as { total?: string | number } | undefined;
  return Number(r?.total ?? 0);
}

function rowToDto(row: MessageLogRow): WhatsAppMessageLogDTO {
  return {
    id: row.id,
    userId: row.userId,
    patientId: row.patientId,
    schedulingId: row.schedulingId,
    scheduleMessageType: row.scheduleMessageType,
    scheduleMessageConfigId: row.scheduleMessageConfigId,
    message: row.message,
    toPhone: row.toPhone,
    instanceName: row.instanceName,
    status: row.status,
    providerMessageId: row.providerMessageId,
    errorMessage: row.errorMessage,
    sentAt: toIso(row.sentAt),
    deliveredAt: toIso(row.deliveredAt),
    readAt: toIso(row.readAt),
    createdAt: toIso(row.created_at) ?? "",
    updatedAt: toIso(row.updated_at) ?? "",
  };
}

export class KnexWhatsAppMessageLogRepository
  implements IWhatsAppMessageLogRepository
{
  async findById(id: string): Promise<WhatsAppMessageLogDTO | null> {
    try {
      const row = await Knex(ETableNames.WHATSAPP_MESSAGE_LOGS)
        .where({ id })
        .first();
      return row ? rowToDto(row as MessageLogRow) : null;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getBySchedulingAndCampaignId(props: GetBySchedulingAndCampaignIdProps): Promise<WhatsAppMessageLogDTO | null> {
    try {
      const row = await Knex(ETableNames.WHATSAPP_MESSAGE_LOGS)
        .where({
          schedulingId: props.schedulingId,
          scheduleMessageConfigId: props.campaignId,
        })
        .first();
      return row ? rowToDto(row) : null;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async save(data: SaveWhatsAppMessageLogProps): Promise<void> {
    try {
      await Knex(ETableNames.WHATSAPP_MESSAGE_LOGS).insert({
        id: data.id,
        userId: data.userId,
        patientId: data.patientId,
        schedulingId: data.schedulingId,
        scheduleMessageType: data.scheduleMessageType,
        scheduleMessageConfigId: data.scheduleMessageConfigId,
        message: data.message,
        toPhone: data.toPhone,
        instanceName: data.instanceName,
        status: data.status,
        providerMessageId: data.providerMessageId,
        errorMessage: data.errorMessage ?? null,
        sentAt: Knex.fn.now(),
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async updateByProviderMessageId(
    data: UpdateWhatsAppMessageLogByProviderIdProps,
  ): Promise<void> {
    try {
      const patch: Record<string, unknown> = { status: data.status };
      if (data.errorMessage !== undefined) {
        patch.errorMessage = data.errorMessage;
      }
      if (data.deliveredAt !== undefined) {
        patch.deliveredAt = data.deliveredAt;
      }
      if (data.readAt !== undefined) {
        patch.readAt = data.readAt;
      }

      await Knex(ETableNames.WHATSAPP_MESSAGE_LOGS)
        .where({ providerMessageId: data.providerMessageId })
        .update(patch);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listByUserId(
    filter: ListWhatsAppMessageLogsFilter,
  ): Promise<ListWhatsAppMessageLogsResult> {
    try {
      const base = () => {
        let q = Knex(ETableNames.WHATSAPP_MESSAGE_LOGS).where({
          userId: filter.userId,
        });

        if (filter.patientId) {
          q = q.andWhere({ patientId: filter.patientId });
        }

        if (filter.scheduleMessageType) {
          q = q.andWhere({ scheduleMessageType: filter.scheduleMessageType });
        }

        if (filter.scheduleMessageConfigId) {
          q = q.andWhere({
            scheduleMessageConfigId: filter.scheduleMessageConfigId,
          });
        }

        if (filter.status) {
          q = q.andWhere({ status: filter.status });
        }

        return q;
      };

      const countResult = await base().clone().count("* as total");
      const total = countTotal(countResult);

      const rows = (await base()
        .clone()
        .orderBy("created_at", "desc")
        .limit(filter.limit)
        .offset(filter.offset)) as MessageLogRow[];

      return {
        items: rows.map(rowToDto),
        total,
      };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async summaryByUserId(
    userId: string,
    filter?: {
      patientId?: string;
      scheduleMessageType?: ScheduleMessageType;
      scheduleMessageConfigId?: string;
    },
  ): Promise<WhatsAppMessageLogsSummaryDTO> {
    try {
      let base = Knex(ETableNames.WHATSAPP_MESSAGE_LOGS).where({ userId });

      if (filter?.patientId) {
        base = base.andWhere({ patientId: filter.patientId });
      }
      if (filter?.scheduleMessageType) {
        base = base.andWhere({ scheduleMessageType: filter.scheduleMessageType });
      }
      if (filter?.scheduleMessageConfigId) {
        base = base.andWhere({
          scheduleMessageConfigId: filter.scheduleMessageConfigId,
        });
      }

      const groupedResult = await base
        .clone()
        .groupBy("status")
        .select("status")
        .count("* as total");

      const rows = Array.isArray(groupedResult)
        ? groupedResult
        : [groupedResult];

      const byStatus: Record<WhatsAppMessageLogStatus, number> = {
        PENDING: 0,
        SENT: 0,
        DELIVERED: 0,
        READ: 0,
        FAILED: 0,
      };

      let total = 0;
      for (const row of rows as {
        status: WhatsAppMessageLogStatus;
        total: string | number;
      }[]) {
        const c = Number(row.total);
        const st = row.status;
        if (st in byStatus) {
          byStatus[st] = c;
        }
        total += c;
      }

      const deliveredOrRead = byStatus.DELIVERED + byStatus.READ;
      const denomDelivery =
        byStatus.SENT + byStatus.DELIVERED + byStatus.READ + byStatus.FAILED;
      const deliveryRate =
        denomDelivery > 0 ? deliveredOrRead / denomDelivery : null;

      const denomRead = byStatus.DELIVERED + byStatus.READ;
      const readRate = denomRead > 0 ? byStatus.READ / denomRead : null;

      return { total, byStatus, deliveryRate, readRate };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
