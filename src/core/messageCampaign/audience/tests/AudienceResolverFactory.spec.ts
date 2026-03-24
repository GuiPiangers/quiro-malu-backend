import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { AudienceResolverFactory } from "../AudienceResolverFactory";
import { MostFrequentAudienceResolver } from "../resolvers/MostFrequentAudienceResolver";
import { MostRecentAudienceResolver } from "../resolvers/MostRecentAudienceResolver";
import { SpecificPatientsAudienceResolver } from "../resolvers/SpecificPatientsAudienceResolver";

describe("AudienceResolverFactory", () => {
  it("should return the correct resolver for each audienceType", () => {
    const patientRepository = createMockPatientRepository();

    const factory = new AudienceResolverFactory(patientRepository);

    expect(factory.make({ audienceType: "MOST_RECENT" } as any)).toBeInstanceOf(
      MostRecentAudienceResolver,
    );
    expect(factory.make({ audienceType: "MOST_FREQUENT" } as any)).toBeInstanceOf(
      MostFrequentAudienceResolver,
    );
    expect(factory.make({ audienceType: "SPECIFIC_PATIENTS" } as any)).toBeInstanceOf(
      SpecificPatientsAudienceResolver,
    );
  });
});
