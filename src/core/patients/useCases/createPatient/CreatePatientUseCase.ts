import { Patient, PatientDTO } from "../../models/entities/Patient";
import { Location } from "../../models/shared/Location";
import { ILocationRepository } from "../../repositories/location/ILocatinRepository";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";

export class CreatePatientUseCase {
  constructor(private patientRepository: IPatientRepository, private locationRepository: ILocationRepository) { }

  async execute(data: PatientDTO, userId: string) {
    const patient = new Patient(data)
    const { location, ...patientDTO } = patient.getPatientDTO()

    if (patient.cpf) {
      const [verifyCpf] = await this.patientRepository.getByCpf(patient.cpf, userId)
      if (verifyCpf) throw new Error('Já existe um usuário cadastrado com esse CPF')
    }

    await this.patientRepository.save(patientDTO, userId);

    if (location) {
      await this.locationRepository.save(location, patient.id, userId)
    }

    return patient
  }
}
