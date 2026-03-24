import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { PatientDTO } from "../../../patients/models/Patient";
import { MessageCampaignDTO } from "../../models/MessageCampaign";
import { IAudienceResolver } from "../IAudienceResolver";

export class AfterAppointmentAudienceResolver implements IAudienceResolver {
  constructor(
    private schedulingRepository: ISchedulingRepository,
    private patientRepository: IPatientRepository,
  ) {}

  async resolve(campaign: MessageCampaignDTO): Promise<PatientDTO[]> {
    if (!campaign.userId) throw new ApiError("campaign.userId is required", 500);

    if (campaign.audienceOffsetMinutes === undefined)
      throw new ApiError("campaign.audienceOffsetMinutes is required", 400);

    const schedulings = await this.schedulingRepository.listFromNowWithinMinutes({
      userId: campaign.userId,
      offsetMinutes: campaign.audienceOffsetMinutes,
    });

    const patientIds = [...new Set(schedulings.map((s) => s.patientId))];

    const patients = await Promise.all(
      patientIds.map(async (id) => {
        const [patient] = await this.patientRepository.getById(id, campaign.userId!);
        return patient;
      }),
    );

    const filtered = patients.filter(Boolean) as PatientDTO[];

    if (campaign.audienceLimit !== undefined) {
      const limit = Math.min(Math.max(campaign.audienceLimit, 0), 100);
      return filtered.slice(0, limit);
    }

    return filtered;
  }
}
