import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { uniformString } from "../../../../utils/uniformString";

export class ListPatientsUseCase {
  constructor(private patientsRepository: IPatientRepository) { }

  async execute({ userId, page, search }: { userId: string, page: number, search?: { name?: string } }) {
    const limit = 20
    const offSet = page ? limit * (page - 1) : 0
    const getPatients = this.patientsRepository.getAll(userId, { limit, offSet, search })
    const countPatients = this.patientsRepository.countAll(userId, search)

    const [patients, total] = await Promise.all([getPatients, countPatients])

    if (search?.name && search?.name.length > 0) {
      return patients.sort((a, b) => {
        const aIndex = uniformString(a.name).match(uniformString(search.name!))?.index || -1
        const bIndex = uniformString(b.name).match(uniformString(search.name!))?.index || -1
        return aIndex - bIndex
      })
    }

    return { patients, total: total[0]['total'], limit }
  }
}