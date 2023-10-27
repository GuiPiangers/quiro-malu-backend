import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";

export class ListPatientsUseCase {
  constructor(private patientsRepository: IPatientRepository) { }

  async execute(userId: string) {
    const patients = await this.patientsRepository.getAll(userId)
    return patients
  }
}