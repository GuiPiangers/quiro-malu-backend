import { IBlockScheduleRepository } from '../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository'
import { ApiError } from '../../../../../utils/ApiError'
import { DateTime } from '../../../../shared/Date'
import { BlockScheduleDto } from '../../../models/dtos/BlockSchedule.dto'
import type { PermissionScope } from '../../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../../utils/eventsPermissionScope'

export interface ListBlockSchedulingDTO {
  startDate: string
  endDate: string
  userId: string
  requestUserId: string
  eventsReadScope?: PermissionScope | null
}

export class ListBlockSchedulingUseCase {
  constructor(private blockSchedulingRepository: IBlockScheduleRepository) {}

  async execute(
    blockSchedulingDTO: ListBlockSchedulingDTO,
  ): Promise<BlockScheduleDto[]> {
    const { startDate, endDate, userId, requestUserId, eventsReadScope } =
      blockSchedulingDTO

    assertEventsScopeAccess(userId, {
      requestUserId,
      eventsScope: eventsReadScope,
    })

    const startDateTime = new DateTime(startDate)
    const endDateTime = new DateTime(endDate)

    if (startDateTime.dateTime >= endDateTime.dateTime) {
      throw new ApiError(
        'Start date must be before end date',
        400,
        'INVALID_DATE_RANGE',
      )
    }

    const blockSchedules =
      await this.blockSchedulingRepository.listBetweenDates({
        userId,
        startDate: startDateTime,
        endDate: endDateTime,
      })

    return blockSchedules.map((blockSchedule) => ({
      id: blockSchedule.id,
      date: blockSchedule.date.dateTime,
      endDate: blockSchedule.endDate.dateTime,
      description: blockSchedule.description,
    }))
  }
}
