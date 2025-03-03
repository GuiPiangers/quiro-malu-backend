import { Patient, PatientDTO } from "../../../models/Patient";
import { CreatePatientUseCase } from "../CreatePatientUseCase";
import { ApiError } from "../../../../../utils/ApiError";
import { createMockPatientRepository } from "../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockLocationRepository } from "../../../../../repositories/_mocks/LocationRepositoryMock";

describe("Create patients", () => {
  let createPatientUseCase: CreatePatientUseCase;
  const userId = "userId";
  const mockPatientRepository = createMockPatientRepository();
  const mockLocationRepository = createMockLocationRepository();

  beforeAll(() => {
    jest.clearAllMocks();
    createPatientUseCase = new CreatePatientUseCase(
      mockPatientRepository,
      mockLocationRepository,
    );
  });

  it("Should not be able to create a patient with an existing CPF", async () => {
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

  it("Should not be able to create a patient that already exists", async () => {
    const patientData: PatientDTO = new Patient({
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      dateOfBirth: "2000-10-10",
    }).getPatientDTO();

    mockPatientRepository.getByHash.mockResolvedValue(patientData);

    await expect(
      createPatientUseCase.execute(patientData, userId),
    ).rejects.toThrow(ApiError);

    try {
      await createPatientUseCase.execute(patientData, userId);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.message).toBe(
        "Já existe um paciente cadastrado com esses dados",
      );
      expect(err.statusCode).toBe(400);
    }
  });

  it("Should be able to create patient when cpf is not registered", async () => {
    const cpf = "036.638.400-00";
    const patientData: PatientDTO = {
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      cpf,
      location: { address: "Rua Teste" },
    };

    mockPatientRepository.getByCpf.mockResolvedValueOnce([]);
    mockPatientRepository.getByHash.mockResolvedValue(undefined);
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
  it("Should be able to create patient without pass a cpf", async () => {
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
