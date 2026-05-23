import { IPatientRepository } from '../../../../repositories/patient/IPatientRepository'

export class GetPatientsByBirthDayUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute({
    birthMonth,
    birthDay,
    clinicId,
  }: {
    birthMonth: number
    birthDay: number
    clinicId?: string
  }) {
    return this.patientRepository.getByBirthMonthAndDay({
      birthMonth,
      birthDay,
      clinicId,
    })
  }
}
