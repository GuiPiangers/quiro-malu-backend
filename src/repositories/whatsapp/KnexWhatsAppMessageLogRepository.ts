import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  IWhatsAppMessageLogRepository,
  SaveWhatsAppMessageLogProps,
  UpdateWhatsAppMessageLogByProviderIdProps,
} from "./IWhatsAppMessageLogRepository";

export class KnexWhatsAppMessageLogRepository
  implements IWhatsAppMessageLogRepository
{
  async save(data: SaveWhatsAppMessageLogProps): Promise<void> {
    try {
      await Knex(ETableNames.WHATSAPP_MESSAGE_LOGS).insert({
        id: data.id,
        userId: data.userId,
        patientId: data.patientId,
        schedulingId: data.schedulingId,
        beforeScheduleMessageId: data.beforeScheduleMessageId,
        message: data.message,
        toPhone: data.toPhone,
        instanceName: data.instanceName,
        status: data.status,
        providerMessageId: data.providerMessageId,
        errorMessage: data.errorMessage ?? null,
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

      await Knex(ETableNames.WHATSAPP_MESSAGE_LOGS)
        .where({ providerMessageId: data.providerMessageId })
        .update(patch);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
