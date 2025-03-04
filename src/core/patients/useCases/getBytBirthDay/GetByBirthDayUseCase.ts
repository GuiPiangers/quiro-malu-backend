import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";

export class GetPatientsByBirthDayUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute({
    dateOfBirth,
    userId,
  }: {
    dateOfBirth: string;
    userId: string;
  }) {
    const patients = await this.patientRepository.getByDateOfBirth({
      dateOfBirth,
    });

    return patients;
  }
}
