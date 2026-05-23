import { Scheduling, SchedulingDTO } from '../../models/Scheduling'
import { IBlockScheduleRepository } from '../../../../repositories/blockScheduleRepository/IBlockScheduleRepository'
import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import { ApiError } from '../../../../utils/ApiError'
import { getValidObjectValues } from '../../../../utils/getValidObjectValues'
import { DateTime } from '../../../shared/Date'
import DatabaseStatusStrategy from '../../models/status/DatabaseStatusStrategy'
import {
  appEventListener,
  IAppEventListener,
} from '../../../shared/observers/EventListener'

export type UpdateSchedulingInput = Omit<SchedulingDTO, 'patientId'> & {
  patientId?: string
  clinicId: string
  /** Usuário autenticado; reservado para validações de permissão futuras. */
  requestUserId?: string
}

export class UpdateSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private BlockSchedulingRepository: IBlockScheduleRepository,
    private readonly clinicianRepository: IClinicianRepository,
    private readonly events: IAppEventListener = appEventListener,
  ) {}

  async execute({
    requestUserId: _requestUserId,
    clinicId,
    userId: requestedUserId,
    ...data
  }: UpdateSchedulingInput) {
    if (!data.id) {
      throw new ApiError('O id deve ser informado', 400, 'Scheduling')
    }

    const dataBaseStatusStrategy = new DatabaseStatusStrategy()
    const rows = await this.SchedulingRepository.get({
      id: data.id,
      clinicId,
    })
    const [repositorySchedule] = rows ?? []

    if (!repositorySchedule) {
      throw new ApiError('Agendamento não encontrado', 404)
    }

    const effectiveUserId = await this.resolveClinicianUserId({
      requestedUserId,
      currentUserId: repositorySchedule.userId,
      clinicId,
    })

    const scheduling = new Scheduling(
      {
        ...repositorySchedule,
        ...getValidObjectValues(data),
        userId: effectiveUserId,
      },
      dataBaseStatusStrategy,
    )

    const { id: _schedulingId, ...schedulingDTO } = scheduling.getDTO()

    await this.validateBlockSchedules({ scheduling, userId: effectiveUserId })
    await this.validateDate({ scheduling, clinicId, userId: effectiveUserId })

    await this.SchedulingRepository.update({
      clinicId,
      id: data.id,
      ...schedulingDTO,
      userId: effectiveUserId,
    })

    this.events.emit('updateSchedule', {
      ...schedulingDTO,
      userId: effectiveUserId,
      clinicId,
      scheduleId: data.id,
    })

    return { ...schedulingDTO, id: data.id, userId: effectiveUserId }
  }

  private async resolveClinicianUserId({
    requestedUserId,
    currentUserId,
    clinicId,
  }: {
    requestedUserId?: string
    currentUserId?: string
    clinicId: string
  }): Promise<string> {
    const userId = requestedUserId ?? currentUserId

    if (!userId) {
      throw new ApiError('O usuário informado não é um clínico', 400, 'userId')
    }

    const clinician = await this.clinicianRepository.findById({
      id: userId,
      clinicId,
    })

    if (!clinician) {
      throw new ApiError('O usuário informado não é um clínico', 400, 'userId')
    }

    return userId
  }

  private async validateBlockSchedules({
    scheduling,
    userId,
  }: {
    scheduling: Scheduling
    userId: string
  }) {
    const blockSchedules =
      scheduling.date && scheduling.endDate
        ? await this.BlockSchedulingRepository.listBetweenDates({
            userId,
            endDate: scheduling.date,
            startDate: scheduling.endDate,
          })
        : []

    blockSchedules?.forEach((blockSchedule) => {
      const scheduleOverlaps = blockSchedule.overlapsWithSchedule(scheduling)

      if (scheduleOverlaps) {
        throw new ApiError(
          `O horário informado está bloqueado por um evento ${
            blockSchedule.description ?? ''
          }`,
        )
      }
    })
  }

  private async validateDate({
    scheduling,
    clinicId,
    userId,
  }: {
    scheduling: Scheduling
    clinicId: string
    userId: string
  }) {
    if (!scheduling.date?.dateTime) return

    const schedules = await this.SchedulingRepository.list({
      clinicId,
      date: new DateTime(scheduling.date.dateTime).date,
      userId,
    })

    if (scheduling.notAvailableDate(schedules)) {
      throw new ApiError('Horário indisponível', 400, 'date')
    }
  }
}
