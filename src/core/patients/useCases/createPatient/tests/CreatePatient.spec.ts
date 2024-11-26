import { PatientDTO } from "../../../models/Patient";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { CreatePatientUseCase } from "../CreatePatientUseCase";
import { ILocationRepository } from "../../../../../repositories/location/ILocationRepository";
import { ApiError } from "../../../../../utils/ApiError";

const mockPatientRepository: jest.Mocked<IPatientRepository> = {
  getById: jest.fn(),
  countAll: jest.fn(),
  delete: jest.fn(),
  getAll: jest.fn(),
  getByCpf: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  getByHash: jest.fn(),
  saveMany: jest.fn(),
};

const mockLocationRepository: jest.Mocked<ILocationRepository> = {
  getLocation: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
} as jest.Mocked<ILocationRepository>;

describe("Create patients", () => {
  let createPatientUseCase: CreatePatientUseCase;
  const userId = "userId";

  beforeAll(() => {
    jest.clearAllMocks();
    createPatientUseCase = new CreatePatientUseCase(
      mockPatientRepository,
      mockLocationRepository,
    );
  });

  it("Should not be able to cadastre a patient with an existing CPF", async () => {
    const patientData: PatientDTO = {
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      cpf: "111.111.111-11",
    };

    mockPatientRepository.getByCpf.mockResolvedValue([
      { name: "Patient Name", phone: "(51) 9 9999-999", cpf: "111.111.111-11" },
    ]);

    await expect(
      createPatientUseCase.execute(patientData, userId),
    ).rejects.toThrow(ApiError);

    try {
      await createPatientUseCase.execute(patientData, userId);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe("Já existe um usuário cadastrado com esse CPF");
      expect(err.statusCode).toBe(400);
      expect(err.type).toBe("cpf");
    }
  });

  it("Should be able to cadastre patient when cpf is not registered", async () => {
    const cpf = "036.638.400-00";
    const patientData: PatientDTO = {
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      cpf,
      location: { address: "Rua Teste" },
    };

    mockPatientRepository.getByCpf.mockResolvedValueOnce([]);
    mockPatientRepository.save.mockResolvedValueOnce();

    const patient = await createPatientUseCase.execute(patientData, userId);

    expect(patient).toHaveProperty("id");
    expect(mockPatientRepository.getByCpf).toHaveBeenCalledWith(cpf, userId);
    expect(mockPatientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: patientData.name,
        phone: patientData.phone,
        cpf,
      }),
      userId,
    );
    expect(mockLocationRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ address: "Rua Teste" }),
      expect.any(String),
      userId,
    );
  });
  it("Should be able to cadastre patient without pass a cpf", async () => {
    const patientData: PatientDTO = {
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
    };

    mockPatientRepository.getByCpf.mockResolvedValueOnce([]);
    mockPatientRepository.save.mockResolvedValueOnce();

    const patient = await createPatientUseCase.execute(patientData, userId);

    expect(patient).toHaveProperty("id");
    expect(mockPatientRepository.getByCpf).not.toBeCalled();
    expect(mockPatientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: patientData.name,
        phone: patientData.phone,
      }),
      userId,
    );
  });

  it("Should save location when the location exists", async () => {
    const patientData: PatientDTO = {
      name: "John Doe",
      phone: "(51) 99999 9999",
      location: {
        address: "Rua Teste",
        city: "Cidade",
        neighborhood: "Bairro",
        state: "Rio Grande do Sul",
      },
    };

    mockPatientRepository.getByCpf.mockResolvedValueOnce([]);
    mockPatientRepository.save.mockResolvedValueOnce();

    await createPatientUseCase.execute(patientData, userId);

    expect(mockLocationRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        address: "Rua Teste",
        city: "Cidade",
        neighborhood: "Bairro",
        state: "Rio Grande do Sul",
      }),
      expect.any(String),
      userId,
    );
  });

  it("Should create a patient without save location if location doesn't exist", async () => {
    const patientData: PatientDTO = {
      name: "Jane Doe",
      phone: "(51) 99999 9999",
    };

    mockPatientRepository.getByCpf.mockResolvedValueOnce([]);
    mockPatientRepository.save.mockResolvedValueOnce();

    await createPatientUseCase.execute(patientData, userId);

    expect(mockLocationRepository.save).not.toHaveBeenCalled();
  });
});

export {};
