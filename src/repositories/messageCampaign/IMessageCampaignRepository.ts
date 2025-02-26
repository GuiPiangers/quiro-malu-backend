import { MessageCampaignDTO } from "../../core/messageCampaign/models/MessageCampaign";

export type SaveMessageCampaignProps = MessageCampaignDTO & { userId: string };

export type setNotMessagePatientsProps = Array<{
  messageCampaignId: string;
  patientId: string;
}>;

export type removeNotMessagePatientsProps = Array<{
  messageCampaignId: string;
  patientId: string;
}>;

export type listNotMessagePatients = {
  messageCampaignId: string;
};

export interface IMessageCampaignRepository {
  save(data: SaveMessageCampaignProps): Promise<void>;
  getMessageCampaign(): Promise<MessageCampaignDTO>;
  setNotMessagePatients(data: setNotMessagePatientsProps): Promise<void>;
  removeNotMessagePatients(data: removeNotMessagePatientsProps): Promise<void>;
  listNotMessagePatients(
    data: listNotMessagePatients,
  ): Promise<Array<{ messageCampaignId: string; patientId: string }>>;
}
