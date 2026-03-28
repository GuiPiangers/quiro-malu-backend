import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import { WhatsAppInstanceDTO } from "../../core/whatsapp/models/WhatsAppInstance";
import { IWhatsAppInstanceRepository } from "./IWhatsAppInstanceRepository";

export class KnexWhatsAppInstanceRepository
  implements IWhatsAppInstanceRepository
{
  async save(instance: WhatsAppInstanceDTO): Promise<void> {
    try {
      await Knex(ETableNames.WHATSAPP_INSTANCES).insert({
        id: instance.id,
        userId: instance.userId,
        instanceName: instance.instanceName,
        phoneNumber: instance.phoneNumber ?? null,
      });
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await Knex(ETableNames.WHATSAPP_INSTANCES).where({ id }).delete();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getByUserId(userId: string): Promise<WhatsAppInstanceDTO | null> {
    try {
      const row = await Knex(ETableNames.WHATSAPP_INSTANCES)
        .select("id", "userId", "instanceName", "phoneNumber")
        .where({ userId })
        .first();

      if (!row) return null;

      return row as WhatsAppInstanceDTO;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getByInstanceName(
    instanceName: string,
  ): Promise<WhatsAppInstanceDTO | null> {
    try {
      const row = await Knex(ETableNames.WHATSAPP_INSTANCES)
        .select("id", "userId", "instanceName", "phoneNumber")
        .where({ instanceName })
        .first();

      if (!row) return null;

      return row as WhatsAppInstanceDTO;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
