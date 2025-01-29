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
});

export {};
