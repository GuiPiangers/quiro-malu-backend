import { IPatientRepository } from "../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../utils/ApiError";
import { MessageCampaignDTO } from "../models/MessageCampaign";
import { IAudienceResolver } from "./IAudienceResolver";
import { AfterAppointmentAudienceResolver } from "./resolvers/AfterAppointmentAudienceResolver";
import { BeforeAppointmentAudienceResolver } from "./resolvers/BeforeAppointmentAudienceResolver";
import { MostFrequentAudienceResolver } from "./resolvers/MostFrequentAudienceResolver";
import { MostRecentAudienceResolver } from "./resolvers/MostRecentAudienceResolver";
import { SpecificPatientsAudienceResolver } from "./resolvers/SpecificPatientsAudienceResolver";

export class AudienceResolverFactory {
  constructor(
    private patientRepository: IPatientRepository,
    private schedulingRepository: ISchedulingRepository,
  ) {}

  make(campaign: MessageCampaignDTO): IAudienceResolver {
    const audienceType = campaign.audienceType;

    switch (audienceType) {
      case "MOST_RECENT":
        return new MostRecentAudienceResolver(this.patientRepository);
      case "MOST_FREQUENT":
        return new MostFrequentAudienceResolver(this.patientRepository);
      case "AFTER_APPOINTMENT":
        return new AfterAppointmentAudienceResolver(
          this.schedulingRepository,
          this.patientRepository,
        );
      case "BEFORE_APPOINTMENT":
        return new BeforeAppointmentAudienceResolver(
          this.schedulingRepository,
          this.patientRepository,
        );
      case "SPECIFIC_PATIENTS":
        return new SpecificPatientsAudienceResolver(this.patientRepository);
      default:
        throw new ApiError("campaign.audienceType is required", 400);
    }
  }
}
