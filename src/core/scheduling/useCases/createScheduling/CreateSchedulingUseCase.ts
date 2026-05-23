import { Scheduling, SchedulingDTO } from '../../models/Scheduling'
import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import { ApiError } from '../../../../utils/ApiError'
import { DateTime } from '../../../shared/Date'
import DatabaseStatusStrategy from '../../models/status/DatabaseStatusStrategy'
import {
  appEventListener,
  IAppEventListener,
} from '../../../shared/observers/EventListener'
import { IBlockScheduleRepository } from '../../../../repositories/blockScheduleRepository/IBlockScheduleRepository'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'

export class CreateSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private BlockSchedulingRepository: IBlockScheduleRepository,
    private readonly clinicianRepository: IClinicianRepository,
    private readonly events: IAppEventListener = appEventListener,
  ) {}

  async execute({
    clinicId,
    userId,
    ...data
  }: SchedulingDTO & { userId: string; clinicId: string; date: string }) {
    const clinician = await this.clinicianRepository.findById({
      id: userId,
      clinicId,
    })
    if (!clinician) {
      throw new ApiError('O usuário informado não é um clínico', 400, 'userId')
    }

    const dataBaseStatusStrategy = new DatabaseStatusStrategy()
    const scheduling = new Scheduling(data, dataBaseStatusStrategy)

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

    const schedulingDTO = scheduling.getDTO()
    const schedules = await this.SchedulingRepository.list({
      clinicId,
      date: new DateTime(data.date).date,
      userId,
    })

    if (scheduling.notAvailableDate(schedules)) {
      throw new ApiError('Horário indisponível', 400, 'date')
    }

    await this.SchedulingRepository.save({
      ...schedulingDTO,
      userId,
      clinicId,
    })

    this.events.emit('createSchedule', {
      ...schedulingDTO,
      userId,
      clinicId,
      scheduleId: schedulingDTO.id,
    })

    return schedulingDTO
  }
}
