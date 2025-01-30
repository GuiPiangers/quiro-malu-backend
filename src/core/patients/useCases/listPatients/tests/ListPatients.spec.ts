import { PatientDTO } from "../../../models/Patient";
import { ListPatientsUseCase } from "../ListPatientsUseCase";
import { mockPatientRepository } from "../../../../../repositories/_mocks/PatientRepositoryMock";

describe("List patients", () => {
  let listPatientUseCase: ListPatientsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listPatientUseCase = new ListPatientsUseCase(mockPatientRepository);
  });

  it("Should be able to list the patients of an User", async () => {
    const patientData: PatientDTO = {
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
    };
    const userId = "userid";

    mockPatientRepository.getAll.mockResolvedValue([{ ...patientData }]);
    mockPatientRepository.countAll.mockResolvedValue([{ total: 0 }]);

    const patients = await listPatientUseCase.execute({ userId, page: 1 });

    expect(patients).toEqual({
      patients: [{ ...patientData }],
      limit: 20,
      total: 0,
    });
  });

  it("Should return a empty array if there is no patients", async () => {
    const userId = "userid2";

    mockPatientRepository.getAll.mockResolvedValue([]);
    mockPatientRepository.countAll.mockResolvedValue([{ total: 0 }]);

    const patients = await listPatientUseCase.execute({ userId, page: 1 });

    expect(patients).toEqual({ limit: 20, total: 0, patients: [] });
  });

  it("should call getAll and countAll with the correct parameters", async () => {
    const userId = "userid2";

    mockPatientRepository.getAll.mockResolvedValue([]);
    mockPatientRepository.countAll.mockResolvedValue([{ total: 0 }]);

    await listPatientUseCase.execute({
      userId,
      page: 2,
      search: { name: "Guilherme" },
      orderBy: [{ field: "name", orientation: "ASC" }],
      limit: 20,
    });

    expect(mockPatientRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockPatientRepository.getAll).toHaveBeenCalledWith(userId, {
      limit: 20,
      offSet: 20,
      search: { name: "Guilherme" },
      orderBy: [{ field: "name", orientation: "ASC" }],
    });

    expect(mockPatientRepository.countAll).toHaveBeenCalledTimes(1);
    expect(mockPatientRepository.countAll).toHaveBeenCalledWith(userId, {
      name: "Guilherme",
    });
  });

  it("should call getAll and countAll with default values if not provided", async () => {
    const userId = "userid2";

    mockPatientRepository.getAll.mockResolvedValue([]);
    mockPatientRepository.countAll.mockResolvedValue([{ total: 0 }]);

    await listPatientUseCase.execute({
      userId,
      page: 1,
    });

    expect(mockPatientRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockPatientRepository.getAll).toHaveBeenCalledWith(userId, {
      limit: 20,
      offSet: 0,
      search: { name: "" },
      orderBy: [{ field: "updated_at", orientation: "DESC" }],
    });

    expect(mockPatientRepository.countAll).toHaveBeenCalledTimes(1);
    expect(mockPatientRepository.countAll).toHaveBeenCalledWith(userId, {
      name: "",
    });
  });

  it("should orderBy name if search.name is provided and orderBy is not", async () => {
    const userId = "userid2";
    const searchName = "Guilherme";

    mockPatientRepository.getAll.mockResolvedValue([]);
    mockPatientRepository.countAll.mockResolvedValue([{ total: 0 }]);

    await listPatientUseCase.execute({
      userId,
      page: 1,
      search: { name: searchName },
    });

    expect(mockPatientRepository.getAll).toHaveBeenCalledTimes(1);
    expect(mockPatientRepository.getAll).toHaveBeenCalledWith(userId, {
      limit: 20,
      offSet: 0,
      search: { name: searchName },
      orderBy: [{ field: `(name like "${searchName}%")`, orientation: "DESC" }],
    });

    expect(mockPatientRepository.countAll).toHaveBeenCalledTimes(1);
    expect(mockPatientRepository.countAll).toHaveBeenCalledWith(userId, {
      name: searchName,
    });
  });
});

export {};
