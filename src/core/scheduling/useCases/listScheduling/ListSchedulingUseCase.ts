import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import { DateTime } from '../../../shared/Date'
import { SchedulingWithPatient } from '../../models/SchedulingWithPatient'
import ClientStatusStrategy from '../../models/status/ClientStatusStrategy'

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
  }: {
    clinicId: string;
    date: string;
    page?: number;
  }) {
    const limit = 20
    const clientStatusStrategy = new ClientStatusStrategy()
    const date = schedulingDate || DateTime.now().dateTime

    const schedulingData = this.SchedulingRepository.list({
      clinicId,
      date,
    })
    const totalScheduling = this.SchedulingRepository.count({
      clinicId,
      date,
    })

    const [schedules, total] = await Promise.all([
      schedulingData,
      totalScheduling,
    ])

    return {
      schedules: schedules.map((scheduling) => {
        return new SchedulingWithPatient(
          scheduling,
          clientStatusStrategy,
        ).getDTO()
      }),
      total: total[0].total,
      limit,
    }
  }
}
