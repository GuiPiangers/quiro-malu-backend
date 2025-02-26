export type MessageCampaignDTO = {
  id?: string;
  name: string;
  templateMessage: string;
  active: boolean;
  initialDate?: string;
  endDate?: string;
};
