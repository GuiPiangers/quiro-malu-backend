import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";
import { PatientDTO } from "../../../patients/models/Patient";
import { MessageCampaignDTO } from "../../models/MessageCampaign";
import { IAudienceResolver } from "../IAudienceResolver";

export class MostFrequentAudienceResolver implements IAudienceResolver {
  constructor(private patientRepository: IPatientRepository) {}

  async resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]> {
    if (!campaign.userId) throw new ApiError("campaign.userId is required", 500);

    const limit = Math.min(Math.max(campaign.audienceLimit ?? 100, 0), 100);

    return await this.patientRepository.getMostFrequent(campaign.userId, limit);
  }
}
