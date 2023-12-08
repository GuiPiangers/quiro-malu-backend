import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { uniformString } from "../../../../utils/uniformString";

export class ListPatientsUseCase {
  constructor(private patientsRepository: IPatientRepository) { }

  async execute({ userId, page, search, orderBy }: {
    userId: string,
    page: number,
    search?: { name?: string }
    orderBy?: { field: string, orientation: 'ASC' | 'DESC' }[]
  }) {
    const limit = 20
    const offSet = page ? limit * (page - 1) : 0
    const orderField = search?.name ? `(name like "${search?.name}%")` : 'updateAt'

    const getPatients = this.patientsRepository.getAll(userId, {
      limit,
      offSet,
      search: search || { name: '' },
      orderBy: orderBy || [{ field: orderField, orientation: 'DESC' }]
    })
    const countPatients = this.patientsRepository.countAll(userId, search || { name: '' })

    const [patients, total] = await Promise.all([getPatients, countPatients])

    if (search?.name && search?.name.length > 0) {
      return {
        patients: patients.sort((a, b) => {
          const aIndex = uniformString(a.name).match(uniformString(search.name!))?.index || -1
          const bIndex = uniformString(b.name).match(uniformString(search.name!))?.index || -1
          return aIndex - bIndex
        }), total: total[0]['total'], limit
      }
    }

    return { patients, total: total[0]['total'], limit }
  }
}