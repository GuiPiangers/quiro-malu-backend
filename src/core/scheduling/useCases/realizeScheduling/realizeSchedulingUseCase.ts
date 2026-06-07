import { IProgressRepository } from '../../../../repositories/progress/IProgressRepository'
import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import { ApiError } from '../../../../utils/ApiError'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'

export class RealizeSchedulingUseCase {
  constructor(
    private schedulingRepository: ISchedulingRepository,
    private progressRepository: IProgressRepository,
  ) {}

  async execute({
    clinicId,
    patientId,
    schedulingId,
    requestUserId,
    eventsWriteScope,
  }: {
    clinicId: string
    patientId: string
    schedulingId: string
    requestUserId: string
    eventsWriteScope?: PermissionScope | null
  }) {
    const [schedule] = await this.schedulingRepository.get({
      id: schedulingId,
      clinicId,
    })
    if (!schedule?.userId) {
      throw new ApiError('Agendamento não encontrado', 404)
    }

    assertEventsScopeAccess(schedule.userId, {
      requestUserId,
      eventsScope: eventsWriteScope,
    })

    const [[progress]] = await Promise.all([
      this.progressRepository.getByScheduling({
        schedulingId,
        clinicId,
        patientId,
      }),
    ])

    if (!progress?.schedulingId) {
      throw new ApiError(
        'A evolução deve ser salva para poder realizar a consulta',
        424,
      )
    }
    await this.schedulingRepository.update({
      id: schedulingId,
      clinicId,
      status: 'Atendido',
    })
  }
}
