import { Patient, PatientDTO } from "../../models/Patient";
import { ILocationRepository } from "../../../../repositories/location/ILocationRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreatePatientUseCase {
  constructor(private patientRepository: IPatientRepository, private locationRepository: ILocationRepository) { }

  async execute(data: PatientDTO, userId: string) {
    const patient = new Patient(data)
    const { location, ...patientDTO } = patient.getPatientDTO()

    if (patient.cpf) {
      const [verifyCpf] = await this.patientRepository.getByCpf(patient.cpf, userId)
      if (verifyCpf) throw new ApiError('Já existe um usuário cadastrado com esse CPF', 400, 'cpf')
    }

    await this.patientRepository.save(patientDTO, userId);

    if (location) {
      await this.locationRepository.save(location, patient.id, userId)
    }

    return patient
  }
}
