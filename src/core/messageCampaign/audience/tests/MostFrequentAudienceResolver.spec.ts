import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { MostFrequentAudienceResolver } from "../resolvers/MostFrequentAudienceResolver";

describe("MostFrequentAudienceResolver", () => {
  it("should call patientRepository.getMostFrequent with min(limit, 100)", async () => {
    const patientRepository = createMockPatientRepository();

    const resolver = new MostFrequentAudienceResolver(patientRepository);

    await resolver.resolve({
      userId: "user-1",
      audienceLimit: 101,
    } as any);

    expect(patientRepository.getMostFrequent).toHaveBeenCalledWith("user-1", 100);
  });
});
