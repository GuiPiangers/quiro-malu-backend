import { MessageCampaignDTO } from "../../core/messageCampaign/models/MessageCampaign";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import { MessageCampaignModel } from "../../database/mongoose/schemas/MessageCampaign";
import {
  GetMessageCampaignProps,
  IMessageCampaignRepository,
  listNotMessagePatients,
  removeNotMessagePatientsProps,
  SaveMessageCampaignProps,
  setNotMessagePatientsProps,
} from "./IMessageCampaignRepository";

export class MessageCampaign implements IMessageCampaignRepository {
  async create(data: SaveMessageCampaignProps): Promise<void> {
    await MessageCampaignModel.create(data);
  }

  async getMessageCampaign(
    data: GetMessageCampaignProps,
  ): Promise<MessageCampaignDTO | null> {
    return await MessageCampaignModel.findOne(data);
  }

  async setNotMessagePatients(data: setNotMessagePatientsProps): Promise<void> {
    await Knex(ETableNames.NOT_MESSAGE_PATIENTS).insert(data);
  }

  async removeNotMessagePatients({
    messageCampaignId,
    patientsId,
  }: removeNotMessagePatientsProps): Promise<void> {
    await Knex(ETableNames.NOT_MESSAGE_PATIENTS)
      .where({ messageCampaignId })
      .whereIn("patientId", patientsId)
      .del();
  }

  async listNotMessagePatients({
    messageCampaignId,
  }: listNotMessagePatients): Promise<
    Array<{ messageCampaignId: string; patientId: string }>
  > {
    return await Knex(ETableNames.NOT_MESSAGE_PATIENTS)
      .select("*")
      .where({ messageCampaignId });
  }
}
