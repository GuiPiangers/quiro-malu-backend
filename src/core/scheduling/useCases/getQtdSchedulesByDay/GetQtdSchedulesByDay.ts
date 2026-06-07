import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'

export class GetQtdSchedulesByDay {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    month,
    year,
    clinicId,
    userId,
    requestUserId,
    eventsReadScope,
  }: {
    month: number
    year: number
    clinicId: string
    userId: string
    requestUserId: string
    eventsReadScope?: PermissionScope | null
  }) {
    assertEventsScopeAccess(userId, {
      requestUserId,
      eventsScope: eventsReadScope,
    })

    const qtdByDates = await this.SchedulingRepository.qdtSchedulesByDay({
      month,
      year,
      clinicId,
      userId,
    })
    return qtdByDates.map((data) => ({
      date: data.formattedDate,
      qtd: data.qtd,
    }))
  }
}
