import { PatientDTO } from "../../../models/Patient";
import { Id } from "../../../../shared/Id";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { InMemoryPatientRepository } from "../../../../../repositories/patient/inMemory/InMemoryPatientRepository";
import { UpdatePatientUseCase } from "../UpdatePatientUseCase";
import { ILocationRepository } from "../../../../../repositories/location/ILocationRepository";
import { InMemoryLocation } from "../../../../../repositories/location/InMemoryLocation";

describe("Update patient", () => {
  let patientRepository: IPatientRepository;
  let updatePatientUseCase: UpdatePatientUseCase;
  let locationRepository: ILocationRepository;

  beforeAll(() => {
    patientRepository = new InMemoryPatientRepository();
    locationRepository = new InMemoryLocation();
    updatePatientUseCase = new UpdatePatientUseCase(
      patientRepository,
      locationRepository,
    );
  });

  it("Should not be able to update a CPF patient to an existing CPF", async () => {
    const id = new Id();
    const id2 = new Id();
    const patientData: PatientDTO = {
      id: id.value,
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      cpf: "036.638.470-80",
    };
    const patientData2: PatientDTO = {
      id: id2.value,
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      cpf: "111.111.111-11",
    };

    const patientUpdated: PatientDTO = {
      id: id.value,
      name: "Guilherme da Silva",
      phone: "(51) 99999 8888",
      gender: "masculino",
      cpf: "111.111.111-11",
    };
    await patientRepository.save(patientData, "userid");
    await patientRepository.save(patientData2, "userid");
    await expect(
      updatePatientUseCase.execute(patientUpdated, "userid"),
    ).rejects.toEqual(
      new Error("Já existe um usuário cadastrado com esse CPF"),
    );
  });

  it("Should be able to update a patient", async () => {
    const id = new Id();
    const patientData: PatientDTO = {
      id: id.value,
      name: "Guilherme Eduardo",
      phone: "(51) 99999 9999",
      cpf: "000.000.000-00",
    };
    const patientUpdated: PatientDTO = {
      id: id.value,
      name: "Guilherme da Silva",
      phone: "(51) 99999 8888",
      gender: "masculino",
      cpf: "000.000.000-00",
    };
    await patientRepository.save(patientData, "id");
    const updatePatient = await updatePatientUseCase.execute(
      patientUpdated,
      "id",
    );
    expect(updatePatient.id).toEqual(patientUpdated.id);
    expect(updatePatient.name.value).toEqual(patientUpdated.name);
    expect(updatePatient.phone).toEqual(patientUpdated.phone);
    expect(updatePatient.gender).toEqual(patientUpdated.gender);
  });
});

export {};
