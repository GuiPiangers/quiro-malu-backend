import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";

export class DeletePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(patientId: string, clinicId: string) {
    await this.patientRepository.delete(patientId, clinicId);
  }
}
