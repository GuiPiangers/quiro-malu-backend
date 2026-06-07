import { ICalendarConfigurationRepository } from '../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository'
import { CalendarConfigurationDTO } from '../../models/CalendarConfiguration'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'

export type GetCalendarConfigurationDTO = {
  userId: string
  requestUserId: string
  eventsReadScope?: PermissionScope | null
}

export class GetCalendarConfigurationUseCase {
  constructor(
    private calendarConfigurationRepository: ICalendarConfigurationRepository,
  ) {}

  async execute({
    userId,
    requestUserId,
    eventsReadScope,
  }: GetCalendarConfigurationDTO): Promise<CalendarConfigurationDTO | null> {
    assertEventsScopeAccess(userId, {
      requestUserId,
      eventsScope: eventsReadScope,
    })

    const config = await this.calendarConfigurationRepository.get({ userId })

    if (!config) {
      return null
    }

    return config.getDTO()
  }
}
