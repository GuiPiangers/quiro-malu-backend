import { MessageCampaignDTO } from "../../core/messageCampaign/models/MessageCampaign";

export type SaveMessageCampaignProps = MessageCampaignDTO & { userId: string };

export type GetMessageCampaignProps = { userId: string; id: string };

export type ListMessageCampaignProps = {
  userId: string;
  config?: { limit: number; offSet: number };
};

export type CountMessageCampaignProps = {
  userId: string;
};

export type setNotMessagePatientsProps = Array<{
  userId: string;
  messageCampaignId: string;
  patientId: string;
}>;

export type removeNotMessagePatientsProps = {
  messageCampaignId: string;
  patientsId: string[];
};

export type listNotMessagePatients = {
  messageCampaignId: string;
};

export interface IMessageCampaignRepository {
  create(data: SaveMessageCampaignProps): Promise<void>;
  get(data: GetMessageCampaignProps): Promise<MessageCampaignDTO | null>;
  list(data: ListMessageCampaignProps): Promise<MessageCampaignDTO[]>;
  listAll(): Promise<MessageCampaignDTO[]>;
  count(data: CountMessageCampaignProps): Promise<number>;
  setNotMessagePatients(data: setNotMessagePatientsProps): Promise<void>;
  removeNotMessagePatients(data: removeNotMessagePatientsProps): Promise<void>;
  listNotMessagePatients(
    data: listNotMessagePatients,
  ): Promise<Array<{ messageCampaignId: string; patientId: string }>>;
}
