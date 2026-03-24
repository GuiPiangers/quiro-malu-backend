import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { SpecificPatientsAudienceResolver } from "../resolvers/SpecificPatientsAudienceResolver";

describe("SpecificPatientsAudienceResolver", () => {
  it("should parse JSON, limit to 100 ids and filter null patients", async () => {
    const patientRepository = createMockPatientRepository();

    patientRepository.getById
      .mockResolvedValueOnce([{ id: "p1", name: "P1", phone: "(51) 90000 9000" } as any])
      .mockResolvedValueOnce([undefined as any]);

    const resolver = new SpecificPatientsAudienceResolver(patientRepository);

    const patients = await resolver.resolve({
      userId: "user-1",
      audiencePatientIds: JSON.stringify(["p1", "p2"]),
    } as any);

    expect(patientRepository.getById).toHaveBeenCalledTimes(2);
    expect(patients).toHaveLength(1);
    expect(patients[0].id).toBe("p1");
  });
});
