import { PatientDTO } from "../../patients/models/Patient";
import { MessageCampaignDTO } from "../models/MessageCampaign";

export interface IAudienceResolver {
  resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]>;
}
