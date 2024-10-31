import { PatientDTO } from "../../../models/Patient";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { InMemoryPatientRepository } from "../../../../../repositories/patient/inMemory/InMemoryPatientRepository";
import { ListPatientsUseCase } from "../ListPatientsUseCase";

describe("List patients", () => {
  let patientRepository: IPatientRepository;
  let listPatientUseCase: ListPatientsUseCase;

  beforeAll(() => {
    patientRepository = new InMemoryPatientRepository();
    listPatientUseCase = new ListPatientsUseCase(patientRepository);
  });

  it("Should be able to list the patients of an User", async () => {
    const patientData: PatientDTO = {
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
    };
    const userId = "userid";
    await patientRepository.save(patientData, userId);
    const patients = await listPatientUseCase.execute({ userId, page: 1 });
    expect(patients).toEqual({
      patients: [{ ...patientData, userId }],
      limit: 20,
      total: 0,
    });
  });

  it("Should return a empty array if there is no patients", async () => {
    const userId = "userid2";
    const patients = await listPatientUseCase.execute({ userId, page: 1 });
    expect(patients).toEqual({ limit: 20, total: 0, patients: [] });
  });
});

export {};
