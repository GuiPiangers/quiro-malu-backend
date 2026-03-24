import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { AudienceResolverFactory } from "../AudienceResolverFactory";
import { AfterAppointmentAudienceResolver } from "../resolvers/AfterAppointmentAudienceResolver";
import { BeforeAppointmentAudienceResolver } from "../resolvers/BeforeAppointmentAudienceResolver";
import { MostFrequentAudienceResolver } from "../resolvers/MostFrequentAudienceResolver";
import { MostRecentAudienceResolver } from "../resolvers/MostRecentAudienceResolver";
import { SpecificPatientsAudienceResolver } from "../resolvers/SpecificPatientsAudienceResolver";

describe("AudienceResolverFactory", () => {
  it("should return the correct resolver for each audienceType", () => {
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();

    const factory = new AudienceResolverFactory(patientRepository, schedulingRepository);

    expect(factory.make({ audienceType: "MOST_RECENT" } as any)).toBeInstanceOf(
      MostRecentAudienceResolver,
    );
    expect(factory.make({ audienceType: "MOST_FREQUENT" } as any)).toBeInstanceOf(
      MostFrequentAudienceResolver,
    );
    expect(factory.make({ audienceType: "AFTER_APPOINTMENT" } as any)).toBeInstanceOf(
      AfterAppointmentAudienceResolver,
    );
    expect(factory.make({ audienceType: "BEFORE_APPOINTMENT" } as any)).toBeInstanceOf(
      BeforeAppointmentAudienceResolver,
    );
    expect(factory.make({ audienceType: "SPECIFIC_PATIENTS" } as any)).toBeInstanceOf(
      SpecificPatientsAudienceResolver,
    );
  });
});
