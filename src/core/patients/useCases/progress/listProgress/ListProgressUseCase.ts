import { IProgressRepository } from '../../../../../repositories/progress/IProgressRepository'

export class ListProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}

  async execute({
    patientId,
    clinicId,
    page,
  }: {
    patientId: string
    clinicId: string
    page?: number
  }) {
    const limit = 10
    const offSet = page ? limit * (page - 1) : 0

    const progressData = this.ProgressRepository.list({
      patientId,
      clinicId,
      config: { limit, offSet },
    })
    const totalProgress = this.ProgressRepository.count({ patientId, clinicId })

    const [progress, total] = await Promise.all([progressData, totalProgress])
    return { progress, total: total[0].total, limit }
  }
}
