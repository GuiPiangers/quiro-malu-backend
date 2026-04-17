import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";

export class GetPatientsByBirthDayUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute({
    birthMonth,
    birthDay,
    userId,
  }: {
    birthMonth: number;
    birthDay: number;
    userId?: string;
  }) {
    return this.patientRepository.getByBirthMonthAndDay({
      birthMonth,
      birthDay,
      userId,
    });
  }
}
