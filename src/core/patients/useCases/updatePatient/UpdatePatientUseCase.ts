import { Patient, PatientDTO } from "../../models/entities/Patient";
import { ILocationRepository } from "../../repositories/location/ILocatinRepository";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";

export class UpdatePatientUseCase {
  constructor(private patientRepository: IPatientRepository, private locationRepository: ILocationRepository) { }

  async execute(data: PatientDTO, userId: string) {
    const patient = new Patient(data)
    const { location, id, ...patientDTO } = patient.getPatientDTO()

    if (patient.cpf) {
      const [verifyPatient] = await this.patientRepository.getByCpf(patient.cpf, userId)
      if (verifyPatient && verifyPatient.id !== patient.id) throw new Error('Já existe um usuário cadastrado com esse CPF')
    }

    const updatePatient = this.patientRepository.update(patientDTO, id!, userId);

    if (location) {
      const [validateLocation] = await this.locationRepository.getLocation(id!)

      if (validateLocation) {
        const updateLocation = this.locationRepository.update(location, id!)
        await Promise.all([updatePatient, updateLocation])
      }
      else {
        const saveLocation = this.locationRepository.save(location, id!, userId)
        await Promise.all([updatePatient, saveLocation])
      }
    }
    else {
      await updatePatient
    }

    return patient
  }
}
