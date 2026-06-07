import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import { ApiError } from '../../../../utils/ApiError'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'
import {
  appEventListener,
  IAppEventListener,
} from '../../../shared/observers/EventListener'

export class DeleteSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private readonly events: IAppEventListener = appEventListener,
  ) {}

  async execute({
    id,
    userId,
    clinicId,
    requestUserId,
    eventsWriteScope,
  }: {
    id: string
    userId: string
    clinicId: string
    requestUserId: string
    eventsWriteScope?: PermissionScope | null
  }) {
    const [schedule] = await this.SchedulingRepository.get({ id, clinicId })
    if (!schedule) {
      throw new ApiError('Agendamento não encontrado', 404)
    }

    const ownerUserId = schedule.userId
    if (!ownerUserId) {
      throw new ApiError('Agendamento não encontrado', 404)
    }

    assertEventsScopeAccess(ownerUserId, {
      requestUserId,
      eventsScope: eventsWriteScope,
    })

    await this.SchedulingRepository.delete({ id, clinicId })
    this.events.emit('deleteSchedule', { scheduleId: id, userId, clinicId })
  }
}
