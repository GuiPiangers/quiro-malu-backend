import { MessageCampaignDTO } from "../../core/messageCampaign/models/MessageCampaign";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import { MessageCampaignModel } from "../../database/mongoose/schemas/MessageCampaign";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import {
  CountMessageCampaignProps,
  GetMessageCampaignProps,
  IMessageCampaignRepository,
  ListMessageCampaignProps,
  listNotMessagePatients,
  removeNotMessagePatientsProps,
  SaveMessageCampaignProps,
  setNotMessagePatientsProps,
} from "./IMessageCampaignRepository";

export class MessageCampaignRepository implements IMessageCampaignRepository {
  async count({ userId }: CountMessageCampaignProps): Promise<number> {
    return await MessageCampaignModel.countDocuments({ userId });
  }

  async listAll(): Promise<MessageCampaignDTO[]> {
    return await MessageCampaignModel.find();
  }

  async list({
    userId,
    config,
  }: ListMessageCampaignProps): Promise<MessageCampaignDTO[]> {
    if (config) {
      const result = await MessageCampaignModel.find({ userId })
        .limit(config.limit)
        .skip(config.offSet);
      return result.map((value) =>
        getValidObjectValues(value as MessageCampaignDTO),
      );
    }
    return await MessageCampaignModel.find({ userId });
  }

  async create(data: SaveMessageCampaignProps): Promise<void> {
    await MessageCampaignModel.create(data);
  }

  async get(data: GetMessageCampaignProps): Promise<MessageCampaignDTO | null> {
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
