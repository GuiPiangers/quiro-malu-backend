import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import { ApiError } from '../../../../utils/ApiError'
import { SchedulingWithPatient } from '../../models/SchedulingWithPatient'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'

export class GetSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({
    id,
    clinicId,
    requestUserId,
    eventsReadScope,
  }: {
    id: string
    clinicId: string
    requestUserId: string
    eventsReadScope?: PermissionScope | null
  }) {
    const [schedulingData] = await this.SchedulingRepository.get({
      id,
      clinicId,
    })

    if (!schedulingData) throw new ApiError('Agendamento não encontrado', 404)

    if (schedulingData.userId) {
      assertEventsScopeAccess(schedulingData.userId, {
        requestUserId,
        eventsScope: eventsReadScope,
      })
    }

    return new SchedulingWithPatient(schedulingData).getDTO()
  }
}
