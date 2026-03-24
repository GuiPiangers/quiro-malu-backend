import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { MostRecentAudienceResolver } from "../resolvers/MostRecentAudienceResolver";

describe("MostRecentAudienceResolver", () => {
  it("should call patientRepository.getMostRecent with min(limit, 100)", async () => {
    const patientRepository = createMockPatientRepository();

    const resolver = new MostRecentAudienceResolver(patientRepository);

    await resolver.resolve({
      userId: "user-1",
      audienceLimit: 200,
    } as any);

    expect(patientRepository.getMostRecent).toHaveBeenCalledWith("user-1", 100);
  });
});
