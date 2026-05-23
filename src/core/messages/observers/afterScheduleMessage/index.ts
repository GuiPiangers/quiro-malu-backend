import { afterScheduleQueue } from '../../../../queues/afterScheduleMessage'
import { afterScheduleMessageRepository } from '../../../../repositories/messages/knexInstances'
import { appEventListener } from '../../../shared/observers/EventListener'
import { AfterScheduleMessageEventHandlers } from './afterScheduleMessageEventHandlers'

const afterScheduleMessageEventHandlers = new AfterScheduleMessageEventHandlers(
  afterScheduleQueue,
  appEventListener,
  afterScheduleMessageRepository,
)

export { afterScheduleMessageEventHandlers }
