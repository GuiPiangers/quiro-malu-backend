import { SetAnamnesisUseCase } from "./SetAnamnesisUseCase";
import { Anamnesis, AnamnesisDTO } from "../../../models/Anamnesis";
import { IAnamnesisRepository } from "../../../../../repositories/anamnesis/IAnamnesisRepository";

describe("SetAnamnesisUseCase", () => {
  let setAnamnesisUseCase: SetAnamnesisUseCase;
  let mockAnamnesisRepository: jest.Mocked<IAnamnesisRepository>;

  beforeEach(() => {
    // Mock do repositório
    mockAnamnesisRepository = {
      get: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      saveMany: jest.fn(),
    } as jest.Mocked<IAnamnesisRepository>;

    setAnamnesisUseCase = new SetAnamnesisUseCase(mockAnamnesisRepository);
  });

  test("should update anamnesis if it already exists", async () => {
    const data: AnamnesisDTO = {
      patientId: "patient123",
      mainProblem: "mainProblem",
      currentIllness: "currentIllness",
      history: "history",
      familiarHistory: "familiarHistory",
      activities: "activities",
      smoke: "yes",
      useMedicine: false,
      underwentSurgery: false,
      medicines: "medicines",
      surgeries: "surgeries",
    };
    const userId = "user456";

    const anamnesis = new Anamnesis(data);

    mockAnamnesisRepository.get.mockResolvedValue([
      { ...anamnesis, patientId: anamnesis.patientId! },
    ]);

    const result = await setAnamnesisUseCase.execute(data, userId);

    expect(mockAnamnesisRepository.get).toHaveBeenCalledWith(
      data.patientId,
      userId,
    );
    expect(mockAnamnesisRepository.update).toHaveBeenCalledWith(data, userId);
    expect(mockAnamnesisRepository.save).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Anamnesis);
    expect(result).toEqual(expect.objectContaining(data));
  });

  test("should save new anamnesis if it does not exist", async () => {
    const data: AnamnesisDTO = {
      patientId: "patient123",
      mainProblem: "mainProblem",
      currentIllness: "currentIllness",
      history: "history",
      familiarHistory: "familiarHistory",
      activities: "activities",
      smoke: "yes",
      useMedicine: false,
      underwentSurgery: false,
      medicines: "medicines",
      surgeries: "surgeries",
    };
    const userId = "user456";

    mockAnamnesisRepository.get.mockResolvedValue([]);

    const result = await setAnamnesisUseCase.execute(data, userId);

    expect(mockAnamnesisRepository.get).toHaveBeenCalledWith(
      data.patientId,
      userId,
    );
    expect(mockAnamnesisRepository.save).toHaveBeenCalledWith(data, userId);
    expect(mockAnamnesisRepository.update).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Anamnesis);
    expect(result).toEqual(expect.objectContaining(data));
  });

  test("should return an instance of Anamnesis with correct data", async () => {
    const data: AnamnesisDTO = {
      patientId: "patient123",
      mainProblem: "mainProblem",
      currentIllness: "currentIllness",
      history: "history",
      familiarHistory: "familiarHistory",
      activities: "activities",
      smoke: "yes",
      useMedicine: false,
      underwentSurgery: false,
      medicines: "medicines",
      surgeries: "surgeries",
    };
    const userId = "user456";

    mockAnamnesisRepository.get.mockResolvedValue([]);

    const result = await setAnamnesisUseCase.execute(data, userId);

    expect(result).toBeInstanceOf(Anamnesis);
    expect(result.patientId).toBe(data.patientId);
  });
});
