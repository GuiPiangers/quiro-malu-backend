import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import { DateTime } from '../../../shared/Date'
import { SchedulingWithPatient } from '../../models/SchedulingWithPatient'
import ClientStatusStrategy from '../../models/status/ClientStatusStrategy'
import type { PermissionScope } from '../../../../types/permissions'
import { isUserIdAllowedInEventsScope } from '../../../../utils/eventsPermissionScope'

/**
 * @deprecated Fluxo legado ligado a `GET /schedules`. O produto usa `ListEventsUseCase` com
 * `GET /events`, que retorna agendamentos e bloqueios no mesmo payload. Não usar em features novas de calendário.
 * @see docs/SCHEDULING_EVENTS.md
 */
export class ListSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    clinicId,
    date: schedulingDate,
    requestUserId,
    eventsReadScope,
  }: {
    clinicId: string
    date: string
    page?: number
    requestUserId: string
    eventsReadScope?: PermissionScope | null
  }) {
    const limit = 20
    const clientStatusStrategy = new ClientStatusStrategy()
    const date = schedulingDate || DateTime.now().dateTime

    const schedules = await this.SchedulingRepository.list({
      clinicId,
      date,
    })

    const filteredSchedules = schedules.filter((scheduling) => {
      if (!scheduling.userId) return true
      return isUserIdAllowedInEventsScope({
        requestUserId,
        targetUserId: scheduling.userId,
        scope: eventsReadScope,
      })
    })

    return {
      schedules: filteredSchedules.map((scheduling) => {
        return new SchedulingWithPatient(
          scheduling,
          clientStatusStrategy,
        ).getDTO()
      }),
      total: filteredSchedules.length,
      limit,
    }
  }
}
