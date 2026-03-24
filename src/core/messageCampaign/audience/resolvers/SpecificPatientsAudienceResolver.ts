import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";
import { PatientDTO } from "../../../patients/models/Patient";
import { MessageCampaignDTO } from "../../models/MessageCampaign";
import { IAudienceResolver } from "../IAudienceResolver";

export class SpecificPatientsAudienceResolver implements IAudienceResolver {
  constructor(private patientRepository: IPatientRepository) {}

  async resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]> {
    if (!campaign.userId) throw new ApiError("campaign.userId is required", 500);

    const rawIds = campaign.audiencePatientIds;

    if (!rawIds) return [];

    let patientIds: string[];

    try {
      patientIds = JSON.parse(rawIds);
      if (!Array.isArray(patientIds)) patientIds = [];
    } catch {
      patientIds = [];
    }

    const safeIds = patientIds.slice(0, 100);

    const patients = await Promise.all(
      safeIds.map(async (id) => {
        const [patient] = await this.patientRepository.getById(id, campaign.userId!);
        return patient;
      }),
    );

    return patients.filter(Boolean) as PatientDTO[];
  }
}
