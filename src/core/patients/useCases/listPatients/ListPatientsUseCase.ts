import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";

export class ListPatientsUseCase {
  constructor(private patientsRepository: IPatientRepository) { }

  async execute({ userId, page }: { userId: string, page: number }) {
    const limit = 20
    const offSet = limit * (page - 1)
    const getPatients = this.patientsRepository.getAll(userId, { limit, offSet })
    const countPatients = this.patientsRepository.countAll(userId)

    const [patients, total] = await Promise.all([getPatients, countPatients])

    return { patients, total: total[0]['total'], limit }
  }
}