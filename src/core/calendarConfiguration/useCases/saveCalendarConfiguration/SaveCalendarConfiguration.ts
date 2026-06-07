import { ICalendarConfigurationRepository } from '../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository'
import {
  CalendarConfiguration,
  DayConfiguration,
} from '../../models/CalendarConfiguration'
import type { PermissionScope } from '../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../utils/eventsPermissionScope'

export type SaveCalendarConfigurationDTO = {
  userId: string
  requestUserId: string
  eventsWriteScope?: PermissionScope | null
  workTimeIncrementInMinutes?: number
  domingo?: DayConfiguration
  segunda?: DayConfiguration
  terca?: DayConfiguration
  quarta?: DayConfiguration
  quinta?: DayConfiguration
  sexta?: DayConfiguration
  sabado?: DayConfiguration
}

export class SaveCalendarConfigurationUseCase {
  constructor(
    private calendarConfigurationRepository: ICalendarConfigurationRepository,
  ) {}

  async execute(dto: SaveCalendarConfigurationDTO) {
    assertEventsScopeAccess(dto.userId, {
      requestUserId: dto.requestUserId,
      eventsScope: dto.eventsWriteScope,
    })

    const existingConfig = await this.calendarConfigurationRepository.get({
      userId: dto.userId,
    })

    const calendarConfiguration = new CalendarConfiguration({
      ...dto,
    })

    if (existingConfig) {
      await this.calendarConfigurationRepository.update({
        calendarConfiguration,
      })
    } else {
      await this.calendarConfigurationRepository.save({
        calendarConfiguration,
      })
    }
  }
}
