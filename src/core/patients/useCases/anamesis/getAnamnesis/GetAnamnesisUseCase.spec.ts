import { GetAnamnesisUseCase } from "./GetAnamnesisUseCase";
import { IAnamnesisRepository } from "../../../../../repositories/anamnesis/IAnamnesisRepository";
import { AnamnesisDTO } from "../../../models/Anamnesis";

const mockAnamnesisRepository = {
  get: jest.fn(),
};

describe("Get anamnesis use case", () => {
  let getAnamnesisUseCase: GetAnamnesisUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getAnamnesisUseCase = new GetAnamnesisUseCase(
      mockAnamnesisRepository as unknown as IAnamnesisRepository,
    );
  });

  it("Should return anamnesis data when found", async () => {
    const userId = "123";
    const patientId = "12345";

    const anamnesisData: AnamnesisDTO = {
      patientId,
      activities: "atividade",
      currentIllness: "doença atual",
      familiarHistory: "historico familiar",
      history: "historico",
      mainProblem: "problema principal",
      medicines: "medicamentos",
      smoke: "no",
      surgeries: "cirurgias",
      underwentSurgery: true,
      useMedicine: true,
    };

    mockAnamnesisRepository.get.mockResolvedValue([anamnesisData]);

    const result = await getAnamnesisUseCase.execute(patientId, userId);
    expect(result).toEqual(anamnesisData);
    expect(mockAnamnesisRepository.get).toHaveBeenCalledTimes(1);
    expect(mockAnamnesisRepository.get).toHaveBeenCalledWith(patientId, userId);
  });

  test("should return undefined when no anamnesis data is found", async () => {
    const patientId = "patient123";
    const userId = "user456";

    mockAnamnesisRepository.get.mockResolvedValue([]);

    const result = await getAnamnesisUseCase.execute(patientId, userId);

    expect(result).toBeUndefined();
    expect(mockAnamnesisRepository.get).toHaveBeenCalledTimes(1);
    expect(mockAnamnesisRepository.get).toHaveBeenCalledWith(patientId, userId);
  });
});
